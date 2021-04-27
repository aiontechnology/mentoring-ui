/**
 * Copyright 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookRepositoryService } from 'src/app/modules/shared/services/resources/book-repository.service';
import { SchoolBookRepositoryService } from '../../../services/school-resource/school-book/school-book-repository.service';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/modules/shared/models/book/book';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DropListBooks } from '../drop-list-books';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ms-school-book-dialog',
  templateUrl: './school-book-dialog.component.html',
  styleUrls: ['./school-book-dialog.component.scss']
})
export class SchoolBookDialogComponent implements OnInit, OnDestroy {

  private schoolId: string;

  tags$: Observable<string[]>;

  booksSubscription$: Subscription;
  books: DropListBooks;
  localBooks: DropListBooks;

  constructor(private bookService: BookRepositoryService,
              private schoolBookService: SchoolBookRepositoryService,
              private dialogRef: MatDialogRef<SchoolBookDialogComponent>,
              private metaDataService: MetaDataService,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.schoolId = this.data?.schoolId;
    this.books = new DropListBooks();
    this.localBooks = new DropListBooks(this.data?.schoolBooks());

  }

  ngOnInit(): void {

    this.bookService.readAllBooks();
    this.booksSubscription$ = this.bookService.items.subscribe(
      books => {
        console.log('Creating new book datasource', books);
        /**
         * Filter out global books from the droplist
         * which are already local to the school.
         */
        const books$ = books.filter(book => !this.schoolHasBook(book));
        this.books = new DropListBooks(books$);
      }
    );

    this.metaDataService.loadTags();
    this.tags$ = this.metaDataService.tags;

  }

  ngOnDestroy(): void {
    this.booksSubscription$.unsubscribe();
  }

  save(): void {
    const newBooks = this.localBooks.data.map(book => book.getSelfLink());
    this.schoolBookService.updateSchoolBooks(this.schoolId, newBooks);
    this.dialogRef.close();
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  drop(event$: CdkDragDrop<Book[]>): void {

    // If the droplist item is dropped back into the same container.
    if (event$.previousContainer === event$.container) {

      // If the item is dropped back in the same container, insert it back into (previous) sorted order.
      moveItemInArray(event$.container.data, event$.previousIndex, event$.previousIndex);

    } else {

      const prevItem = event$.previousContainer.data[event$.previousIndex];

      // Check if book is being transferred from global resources to local.
      if (event$.previousContainer.data !== this.localBooks.filteredData) {
        this.books.removeFromData(prevItem);
        // Insert the book into local resources.
        this.localBooks.insertSorted(prevItem);
      } else {
        this.localBooks.removeFromData(prevItem);
        // Insert the book back into global resources.
        this.books.insertSorted(prevItem);
      }

      /**
       * Find the index of the filteredData to insert at. This overrides
       * the index the droplist item was dropped at, allowing us to
       * maintain alphabetical order.
       */
      event$.currentIndex = DropListBooks.sortedInsertIndex(prevItem, event$.container.data);
      if (event$.currentIndex < 0) {
        event$.currentIndex = event$.container.data.length;
      }

      // Now the filtered (visible) data can be updated.
      transferArrayItem(event$.previousContainer.data,
                        event$.container.data,
                        event$.previousIndex,
                        event$.currentIndex);

    }

  }

  private schoolHasBook(book: Book): boolean {
    for (const b of this.localBooks.data) {
      if (book.id === b.id) {
        return true;
      }
    }
    return false;
  }

}
