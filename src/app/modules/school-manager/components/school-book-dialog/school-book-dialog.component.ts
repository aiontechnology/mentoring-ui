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
import { SchoolBookRepositoryService } from '../../services/school-resource/school-book/school-book-repository.service';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/modules/shared/models/book/book';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ms-school-book-dialog',
  templateUrl: './school-book-dialog.component.html',
  styleUrls: ['./school-book-dialog.component.scss']
})
export class SchoolBookDialogComponent implements OnInit, OnDestroy {

  booksSubscription$: Subscription;
  books: DropListData;
  localBooks: DropListData;

  private schoolId: string;

  constructor(private bookService: BookRepositoryService,
              private schoolBookService: SchoolBookRepositoryService,
              private dialogRef: MatDialogRef<SchoolBookDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.schoolId = this.data?.schoolId;
    this.localBooks = new DropListData(this.data?.schoolBooks());

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
        this.books = new DropListData(books$);
      }
    );
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

    const prevItem = event$.previousContainer.data[event$.previousIndex];

    // Index of the filtered list to insert into.
    event$.currentIndex = DropListData.sortedInsertIndex(prevItem, event$.container.data);
    if (event$.currentIndex < 0) {
      event$.currentIndex = event$.container.data.length;
    }

    // If the droplist item is dropped back into the same container.
    if (event$.previousContainer === event$.container) {
      moveItemInArray(event$.container.data, event$.previousIndex, event$.currentIndex);
    } else {
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

/**
 * DropListData manages the stored (actual) data, and the visible, filtered data
 * presented in the Drop List.
 */
class DropListData {

  data: Book[];
  filteredData: Book[];

  constructor(data: Book[]) {
    this.data = data.sort(this.compareTitle);
    this.filteredData = this.data.slice();
  }

  /**
   * Return the index to insert the book at to keep alphabetical order.
   * @param book The book to be inserted.
   * @param list The list the book will be sorted into.
   * @returns The index to insert at, or -1 if the list is
   * empty or if the book should be appended to the end of the list.
   */
  static sortedInsertIndex(book: Book, list: Book[]): number {
    if (!list.length) {
      return -1;
    }
    for (const [i, v] of list.entries()) {
      if (v.title > book.title) {
        return i;
      } else if (list.length === (i + 1)) {
        return -1;
      }
    }
  }

  applyFilter(filterValue: string): void {
    if (filterValue == null) {
      this.filteredData = this.data.slice();
    } else {
      filterValue = this.cleanInput(filterValue);
      this.filteredData = this.data.filter(book => this.cleanInput(book.title).includes(filterValue));
    }
  }

  clearInput(filter: HTMLInputElement): void {
    filter.value = '';
    this.applyFilter(null);
  }

  removeFromData(book: Book): void {
    const index = this.data.indexOf(book);
    this.data.splice(index, 1);
  }

  /**
   * Insert a book into drop list data, ordered by title.
   * @param book Book to insert.
   * @param list DropListData to insert book into.
   */
  insertSorted(book: Book): void {
    const i = DropListData.sortedInsertIndex(book, this.data);
    if (i < 0) {
      this.data.push(book);
    } else {
      this.data.splice(i, 0, book);
    }
  }

  private compareTitle(a: Book, b: Book): number {
    if (a.title.localeCompare(b.title) < 0) {
      return -1;
    }
    if (a.title.localeCompare(b.title) > 0) {
      return 1;
    }
    return 0;
  }

  private cleanInput(str: string): string {
    return str.trim().toLowerCase();
  }

}
