/*
 * Copyright 2022 Aion Technology LLC
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

import {InjectionToken} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Command} from '../../../implementation/command/command';
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {Repository} from '../../../implementation/data/repository';
import {SingleItemCache} from '../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../../providers/detail-menus-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {Book} from '../../shared/models/book/book';
import {School} from '../../shared/models/school/school';
import {BookDialogComponent} from '../components/book-dialog/book-dialog.component';
import {BookRepository} from '../repositories/book-repository';
import {BOOK_GROUP} from '../resource-manager.module';

export const BOOK_DETAIL_MENU = new InjectionToken<Command[]>('book-detail-menu');
export const BOOK_LIST_MENU = new InjectionToken<Command[]>('book-list-menu');
export const BOOK_SINGLE_CACHE = new InjectionToken<SingleItemCache<Book>>('book-single-cache')
export const BOOK_DATA_SOURCE = new InjectionToken<DataSource<Book>>('book-data-source');
export const BOOK_CACHE = new InjectionToken<Cache<Book>>('book-cache');
export const BOOK_URI_SUPPLIER = new InjectionToken<UriSupplier>('book-uri-supplier');
export const BOOK_TABLE_CACHE = new InjectionToken<TableCache<School>>('book-table-cache')

export function bookProvidersFactory() {
  return [
    ...listProvidersFactory<Book, BookDialogComponent, TableCache<Book>>(BOOK_LIST_MENU, BOOK_GROUP, 'book', BookDialogComponent,
      BOOK_TABLE_CACHE),
    ...detailProvidersFactory<Book, BookDialogComponent, TableCache<Book>>(BOOK_DETAIL_MENU, 'book', 'book',
      ['/resourcemanager'], BookDialogComponent, BOOK_TABLE_CACHE, BOOK_SINGLE_CACHE),
    {
      provide: BOOK_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new TableCache(dataSource),
      deps: [BOOK_DATA_SOURCE]
    },
    {
      provide: BOOK_SINGLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new SingleItemCache<Book>(dataSource),
      deps: [BOOK_DATA_SOURCE]
    },
    {
      provide: BOOK_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/books`)
    },
    BookRepository,
    {
      provide: BOOK_CACHE,
      useFactory: () => new Cache<Book>()
    },
    {
      provide: BOOK_DATA_SOURCE,
      useFactory: (repository: Repository<Book>, cache: Cache<Book>) => new DataSource<Book>(repository, cache),
      deps: [BookRepository, BOOK_CACHE]
    },
  ]
}
