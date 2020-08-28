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
import { BookRepositoryService } from './book-repository.service';
import { DatasourceManager } from 'src/app/modules/school-manager/services/datasource-manager';
import { Book } from '../../models/book/book';

@Injectable()
export class BookCacheService extends DatasourceManager<Book> {

  constructor(private bookService: BookRepositoryService) {
    super();
  }

  establishDatasource(): void {
    this.elements = this.bookService.items;
    this.bookService.readAllBooks();
    this.elements.subscribe(b => {
      console.log('Creating new book datasource');
      this.dataSource.data = b;
    });
  }

  protected doRemoveItem(items: Book[]): void {
    this.bookService.deleteBooks(items);
  }

}
