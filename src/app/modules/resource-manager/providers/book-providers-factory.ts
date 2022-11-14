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
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {DataSource} from '../../../implementation/data/data-source';
import {Book} from '../../../implementation/models/book/book';
import {School} from '../../../implementation/models/school/school';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailDialogManagerProviders} from '../../../providers/dialog/detail-dialog-manager-providers';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {BOOK_DATA_SOURCE, BOOK_INSTANCE_CACHE, BOOK_INSTANCE_CACHE_UPDATER} from '../../../providers/global/global-book-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {BookDialogComponent} from '../components/book-dialog/book-dialog.component';

export const BOOK_TABLE_CACHE = new InjectionToken<TableCache<School>>('book-table-cache')
export const BOOK_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<BookDialogComponent>>('book-detail-edit-dialog-manager')
export const BOOK_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('book-detail-delete-dialog-manager')
export const BOOK_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<BookDialogComponent>>('book-list-edit-dialog-manager')
export const BOOK_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('book-list-delete-dialog-manager')

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
  ]
}
