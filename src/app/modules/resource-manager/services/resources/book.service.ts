/**
 * Copyright 2020 Aion Technology LLC
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../../models/book/book';

@Injectable()
export class BookService {

  private bookUri = environment.apiUri + '/api/v1/books';

  private _books: BehaviorSubject<Book[]>;

  private dataStore: {
    books: Book[];
  };

  constructor(private http: HttpClient) {
    this._books = new BehaviorSubject<Book[]>([]);
    this.dataStore = { books: [] };
  }

  get books(): Observable<Book[]> {
    return this._books;
  }

  addBook(book: Book): Promise<Book> {
    console.log('Adding book', book);
    return new Promise((resolver, reject) => {
      this.http.post(this.bookUri, this.stripLinks(book))
        .subscribe(data => {
          const b = data as Book;
          this.dataStore.books.push(b);
          this.publishBooks();
          resolver(b);
        }, error => {
          console.error('Failed to create book');
        });
    });
  }

  loadAll(): void {
    this.http.get<any>(this.bookUri)
      .subscribe(data => {
        this.dataStore.books = data?._embedded?.bookModelList || [];
        this.logCache();
        this.publishBooks();
      }, error => {
        console.error('Failed to fetch books');
      });
  }

  private logCache(): void {
    for (const book of this.dataStore.books) {
      console.log('Cache entry (book)', book);
    }
  }

  private publishBooks() {
    this._books.next(Object.assign({}, this.dataStore).books);
  }

  private stripLinks(book: Book): Book {
    const b = Object.assign({}, book);
    b._links = undefined;
    return b;
  }

}
