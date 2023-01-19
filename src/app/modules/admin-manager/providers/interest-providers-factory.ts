/*
 * Copyright 2023 Aion Technology LLC
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
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {Interest} from '../../../models/interest';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {INTEREST_DATA_SOURCE} from '../../../providers/global/global-interest-providers-factory';
import {ConfirmationDialogComponent} from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {InterestDialogComponent} from '../components/interest-dialog/interest-dialog.component';

export const INTEREST_TABLE_CACHE = new InjectionToken<TableCache<Interest>>('interest-table-cache')
export const INTEREST_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<InterestDialogComponent>>('interest-list-edit-dialog-manager')
export const INTEREST_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfirmationDialogComponent>>('interest-list-delete-dialog-manager')

export function interestProvidersFactory() {
  return [
    ...listDialogManagerProviders<Interest, InterestDialogComponent, TableCache<Interest>>(
      'interest',
      INTEREST_LIST_EDIT_DIALOG_MANAGER,
      INTEREST_LIST_DELETE_DIALOG_MANAGER,
      InterestDialogComponent,
      INTEREST_TABLE_CACHE
    ),
    {
      provide: INTEREST_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Interest>) => new TableCache('InterestTableCache', dataSource, Interest.nativeOrderComparator),
      deps: [INTEREST_DATA_SOURCE]
    },
  ]
}
