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
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Book} from '../../../implementation/models/book/book';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {updateDialogManagerProviders} from '../../../providers/dialog/update-dialog-manager-providers';
import {SCHOOL_BOOK_DATA_SOURCE} from '../../../providers/global/global-school-book-providers-factory';
import {BookDialogComponent} from '../components/book-dialog/book-dialog.component';
import {SchoolBookDialogComponent} from '../components/school-book-dialog/school-book-dialog.component';

export const SCHOOL_BOOK_TABLE_CACHE = new InjectionToken<UriSupplier>('school-book-table-cache');
export const SCHOOL_BOOK_LIST_MENU = new InjectionToken<Command[]>('school-book-list-menu')
export const BOOK_UPDATE_DIALOG_MANAGER = new InjectionToken<DialogManager<BookDialogComponent>>('book-update-dialog-manager')

export function schoolBookProvidersFactory() {
  return [
    ...updateDialogManagerProviders<SchoolBookDialogComponent>(BOOK_UPDATE_DIALOG_MANAGER, SchoolBookDialogComponent),
    {
      provide: SCHOOL_BOOK_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new TableCache('SchoolBookTableCache', dataSource),
      deps: [SCHOOL_BOOK_DATA_SOURCE]
    },
  ]
}
