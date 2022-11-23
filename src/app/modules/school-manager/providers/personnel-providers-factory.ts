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
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Personnel} from '../../../models/personnel/personnel';
import {School} from '../../../models/school/school';
import {SchoolChangeDataSourceResetter} from '../../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {
  PERSONNEL_CACHE,
  PERSONNEL_DATA_SOURCE,
  PERSONNEL_SCHOOL_CHANGE_RESETTER,
  PERSONNEL_URI_SUPPLIER
} from '../../../providers/global/global-personnel-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {PersonnelDialogComponent} from '../components/school-detail-tabs/personnel-dialog/personnel-dialog.component';

export const PERSONNEL_TABLE_CACHE = new InjectionToken<TableCache<School>>('personnel-table-cache')
export const PERSONNEL_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Personnel>>('personnel-school-change-handler')
export const PERSONNEL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<PersonnelDialogComponent>>('personnel-edit-dialog-manager')
export const PERSONNEL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('personnel-delete-dialog-manager')

export function personnelProvidersFactory() {
  return [
    ...listDialogManagerProviders<Personnel, PersonnelDialogComponent, TableCache<Personnel>>(
      'personnel',
      PERSONNEL_EDIT_DIALOG_MANAGER,
      PERSONNEL_DELETE_DIALOG_MANAGER,
      PersonnelDialogComponent,
      PERSONNEL_TABLE_CACHE
    ),
    {
      provide: PERSONNEL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Personnel>) => new TableCache('PersonnelTableCache', dataSource),
      deps: [PERSONNEL_DATA_SOURCE]
    },
    {
      provide: PERSONNEL_SCHOOL_CHANGE_HANDLER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<Personnel>, uriSupplier: UriSupplier, cache: Cache<Personnel>, tableCache: TableCache<Personnel>) =>
        new SingleItemCacheSchoolChangeHandler<Personnel>('PersonnelSchoolChangeHandler', schoolChangeResetter, uriSupplier, cache, tableCache),
      deps: [PERSONNEL_SCHOOL_CHANGE_RESETTER, PERSONNEL_URI_SUPPLIER, PERSONNEL_CACHE, PERSONNEL_TABLE_CACHE]
    },
  ]
}
