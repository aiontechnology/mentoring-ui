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
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {SCHOOL_BOOK_DATA_SOURCE} from '../../../providers/global-school-book-providers-factory';
import {updateProvidersFactory} from '../../../providers/update-menus-providers-factory';
import {Book} from '../../../implementation/models/book/book';
import {SchoolBookDialogComponent} from '../components/school-book-dialog/school-book-dialog.component';
import {SCHOOL_BOOK_GROUP, SCHOOL_BOOK_LIST_MENU} from '../school-manager.module';

export const SCHOOL_BOOK_TABLE_CACHE = new InjectionToken<UriSupplier>('school-book-table-cache');

export function schoolBookProvidersFactory() {
  return [
    ...updateProvidersFactory<Book, SchoolBookDialogComponent, TableCache<Book>>(SCHOOL_BOOK_LIST_MENU, SCHOOL_BOOK_GROUP, 'Book',
      SchoolBookDialogComponent, SCHOOL_BOOK_TABLE_CACHE),
    {
      provide: SCHOOL_BOOK_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new TableCache(dataSource),
      deps: [SCHOOL_BOOK_DATA_SOURCE]
    },
  ]
}
