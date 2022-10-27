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
import {Personnel} from '../../../implementation/models/personnel/personnel';
import {School} from '../../../implementation/models/school/school';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {PERSONNEL_DATA_SOURCE} from '../../../providers/global-personnel-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {PersonnelDialogComponent} from '../components/school-detail-tabs/personnel-dialog/personnel-dialog.component';
import {PERSONNEL_GROUP, PERSONNEL_LIST_MENU} from '../school-manager.module';

export const PERSONNEL_TABLE_CACHE = new InjectionToken<TableCache<School>>('personnel-table-cache')

export function personnelProvidersFactory() {
  return [
    ...listProvidersFactory<Personnel, PersonnelDialogComponent, TableCache<Personnel>>(PERSONNEL_LIST_MENU, PERSONNEL_GROUP, 'Personnel',
      PersonnelDialogComponent, PERSONNEL_TABLE_CACHE),
    {
      provide: PERSONNEL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Personnel>) => new TableCache(dataSource),
      deps: [PERSONNEL_DATA_SOURCE]
    },
  ]
}
