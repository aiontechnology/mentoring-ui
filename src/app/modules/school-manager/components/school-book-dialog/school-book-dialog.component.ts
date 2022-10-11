/*
 * Copyright 2021-2022 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {Book} from 'src/app/modules/shared/models/book/book';
import {MetaDataService} from 'src/app/modules/shared/services/meta-data/meta-data.service';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {DropListBooks} from '../../../shared/components/school-resource/drop-list-books';
import {School} from '../../../shared/models/school/school';
import {BOOK_DATA_SOURCE, SCHOOL_BOOK_DATA_SOURCE} from '../../../shared/shared.module';
import {SCHOOL_INSTANCE_CACHE} from '../../school-manager.module';
import {SchoolBookCacheService} from '../../services/school-book/school-book-cache.service';

@Component({
  selector: 'ms-school-book-dialog',
  templateUrl: './school-book-dialog.component.html',
  styleUrls: ['./school-book-dialog.component.scss']
})
export class SchoolBookDialogComponent implements OnInit {

  tags$: Observable<string[]>;
  books: DropListBooks;
  localBooks: DropListBooks;

  constructor(@Inject(BOOK_DATA_SOURCE) private bookDataSource: DataSource<Book>,
              @Inject(SCHOOL_BOOK_DATA_SOURCE) private schoolBookDataSource: DataSource<Book>,
              private schoolBookCacheService: SchoolBookCacheService,
              private dialogRef: MatDialogRef<SchoolBookDialogComponent>,
              private metaDataService: MetaDataService,
              @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.books = new DropListBooks();
    this.localBooks = new DropListBooks(this.data?.localItems());

    this.bookDataSource.allValues()
      .then(books => books.filter(book => !this.schoolHasBook(book)))
      .then(books => new DropListBooks(books))
      .then(list => this.books = list);

    this.metaDataService.loadTags();
    this.tags$ = this.metaDataService.tags;
  }

  save(): void {
    this.schoolBookDataSource.updateSet(this.localBooks.data as Book[])
    this.schoolBookCacheService.loadData()
    this.dialogRef.close()
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
        this.localBooks.insertToDataSorted(prevItem);
      } else {
        this.localBooks.removeFromData(prevItem);
        // Insert the book back into global resources.
        this.books.insertToDataSorted(prevItem);
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

  moveGlobalToLocal(): void {
    this.moveTo(this.books, this.localBooks);
  }

  moveLocalToGlobal(): void {
    this.moveTo(this.localBooks, this.books);
  }

  private schoolHasBook(book: Book): boolean {
    for (const b of this.localBooks.data) {
      if (book.id === b.id) {
        return true;
      }
    }
    return false;
  }

  private moveTo(origin: DropListBooks, destination: DropListBooks): void {
    origin.filteredData.forEach((value) => {
      destination.insertToDataSorted(value);
      destination.insertToFilteredSorted(value);
      const i = origin.data.indexOf(value);
      origin.data.splice(i, 1);
    });

    origin.filteredData = [];
  }

}
