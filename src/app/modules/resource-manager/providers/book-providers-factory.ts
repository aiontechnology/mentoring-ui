/*
 * Copyright 2022-2023 Aion Technology LLC
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
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {SchoolChangeDataSourceResetter} from '../../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {Book} from '../../../models/book/book';
import {detailDialogManagerProviders} from '../../../providers/dialog/detail-dialog-manager-providers';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {BOOK_DATA_SOURCE, BOOK_INSTANCE_CACHE, BOOK_INSTANCE_CACHE_UPDATER} from '../../../providers/global/global-book-providers-factory';
import {
  SCHOOL_BOOK_CACHE,
  SCHOOL_BOOK_SCHOOL_CHANGE_RESETTER,
  SCHOOL_BOOK_URI_SUPPLIER
} from '../../../providers/global/global-school-book-providers-factory';
import {ConfirmationDialogComponent} from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {BookDialogComponent} from '../components/book-dialog/book-dialog.component';

export const BOOK_TABLE_CACHE = new InjectionToken<TableCache<Book>>('book-table-cache')
export const BOOK_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Book>>('book-school-change-handler')
export const BOOK_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<BookDialogComponent>>('book-detail-edit-dialog-manager')
export const BOOK_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfirmationDialogComponent>>('book-detail-delete-dialog-manager')
export const BOOK_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<BookDialogComponent>>('book-list-edit-dialog-manager')
export const BOOK_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfirmationDialogComponent>>('book-list-delete-dialog-manager')

export function bookProvidersFactory() {
  return [
    ...detailDialogManagerProviders(
      'book',
      BOOK_DETAIL_EDIT_DIALOG_MANAGER,
      BOOK_DETAIL_DELETE_DIALOG_MANAGER,
      BookDialogComponent,
      BOOK_TABLE_CACHE,
      ['/resourcemanager'],
      BOOK_INSTANCE_CACHE,
      BOOK_INSTANCE_CACHE_UPDATER
    ),
    ...listDialogManagerProviders<Book, BookDialogComponent, TableCache<Book>>(
      'book',
      BOOK_LIST_EDIT_DIALOG_MANAGER,
      BOOK_LIST_DELETE_DIALOG_MANAGER,
      BookDialogComponent,
      BOOK_TABLE_CACHE
    ),
    {
      provide: BOOK_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new TableCache('BookTableCache', dataSource),
      deps: [BOOK_DATA_SOURCE]
    },
    {
      provide: BOOK_SCHOOL_CHANGE_HANDLER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<Book>, uriSupplier: UriSupplier, cache: Cache<Book>, tableCache: TableCache<Book>) =>
        new SingleItemCacheSchoolChangeHandler<Book>('BookSchoolChangeHandler', schoolChangeResetter, uriSupplier, cache, tableCache),
      deps: [SCHOOL_BOOK_SCHOOL_CHANGE_RESETTER, SCHOOL_BOOK_URI_SUPPLIER, SCHOOL_BOOK_CACHE, BOOK_TABLE_CACHE]
    },
  ]
}
