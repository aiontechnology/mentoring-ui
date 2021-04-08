/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { Book } from '../../models/book/book';
import { Observable } from 'rxjs';

@Injectable()
export class BookRepositoryService extends BaseRepository<Book> {

  constructor(http: HttpClient) {
    super('/api/v1/books', http);
  }

  get books(): Observable<Book[]>{
    return this.items;
  }

  getBookById(id: string): Book {
    return this.getById(id);
  }

  createBook(book: Book): Promise<Book> {
    return super.create(this.uriBase, book);
  }

  readAllBooks(): void {
    return super.readAll(this.uriBase);
  }

  readOneBook(id: string): void {
    super.readOne(`${this.uriBase}/${id}`);
  }

  updateBook(book: Book): Promise<Book> {
    return super.update(this.uriBase, book);
  }

  deleteBooks(books: Book[]): Promise<void> {
    return super.delete(books);
  }

  protected fromJSON(json: any): Book {
    return new Book(json);
  }

  protected newItem(): Book {
    return new Book();
  }

}
