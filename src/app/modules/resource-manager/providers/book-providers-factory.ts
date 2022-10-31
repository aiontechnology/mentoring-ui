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
import {Command} from '../../../implementation/command/command';
import {DataSource} from '../../../implementation/data/data-source';
import {Book} from '../../../implementation/models/book/book';
import {School} from '../../../implementation/models/school/school';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../../providers/detail-menus-providers-factory';
import {BOOK_DATA_SOURCE, BOOK_INSTANCE_CACHE, BOOK_INSTANCE_CACHE_UPDATER} from '../../../providers/global-book-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {BookDialogComponent} from '../components/book-dialog/book-dialog.component';
import {BOOK_GROUP} from '../resource-manager.module';

export const BOOK_DETAIL_MENU = new InjectionToken<Command[]>('book-detail-menu');
export const BOOK_LIST_MENU = new InjectionToken<Command[]>('book-list-menu');
export const BOOK_TABLE_CACHE = new InjectionToken<TableCache<School>>('book-table-cache')

export function bookProvidersFactory() {
  return [
    ...listProvidersFactory<Book, BookDialogComponent, TableCache<Book>>(BOOK_LIST_MENU, BOOK_GROUP, 'book', BookDialogComponent,
      BOOK_TABLE_CACHE),
    ...detailProvidersFactory<Book, BookDialogComponent, TableCache<Book>>(BOOK_DETAIL_MENU, 'book', 'book',
      ['/resourcemanager'], BookDialogComponent, BOOK_TABLE_CACHE, BOOK_INSTANCE_CACHE, BOOK_INSTANCE_CACHE_UPDATER),
    {
      provide: BOOK_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new TableCache('BookTableCache', dataSource),
      deps: [BOOK_DATA_SOURCE]
    },
  ]
}
