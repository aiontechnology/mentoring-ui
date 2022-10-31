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
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Personnel} from '../../../implementation/models/personnel/personnel';
import {School} from '../../../implementation/models/school/school';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {PERSONNEL_CACHE, PERSONNEL_DATA_SOURCE, PERSONNEL_URI_SUPPLIER} from '../../../providers/global-personnel-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../providers/global-school-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {PersonnelDialogComponent} from '../components/school-detail-tabs/personnel-dialog/personnel-dialog.component';
import {PERSONNEL_GROUP, PERSONNEL_LIST_MENU} from '../school-manager.module';

export const PERSONNEL_TABLE_CACHE = new InjectionToken<TableCache<School>>('personnel-table-cache')
export const PERSONNEL_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Personnel>>('personnel-school-change-handler')

export function personnelProvidersFactory() {
  return [
    ...listProvidersFactory<Personnel, PersonnelDialogComponent, TableCache<Personnel>>(PERSONNEL_LIST_MENU, PERSONNEL_GROUP, 'Personnel',
      PersonnelDialogComponent, PERSONNEL_TABLE_CACHE),
    {
      provide: PERSONNEL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Personnel>) => new TableCache('PersonnelTableCache', dataSource),
      deps: [PERSONNEL_DATA_SOURCE]
    },
    {
      provide: PERSONNEL_SCHOOL_CHANGE_HANDLER,
      useFactory: (instanceCache: SingleItemCache<School>, uriSupplier: UriSupplier, cache: Cache<Personnel>, tableCache: TableCache<Personnel>) =>
        new SingleItemCacheSchoolChangeHandler<Personnel>('PersonnelSchoolChangeHandler', instanceCache, uriSupplier, cache, tableCache),
      deps: [SCHOOL_INSTANCE_CACHE, PERSONNEL_URI_SUPPLIER, PERSONNEL_CACHE, PERSONNEL_TABLE_CACHE]
    },
  ]
}
