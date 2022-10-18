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
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {Repository} from '../../../implementation/data/repository';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {PersonnelDialogComponent} from '../components/personnel-dialog/personnel-dialog.component';
import {Personnel} from '../models/personnel/personnel';
import {PersonnelRepository} from '../repositories/personnel-repository';
import {PERSONNEL_GROUP, PERSONNEL_LIST_MENU, PERSONNEL_TABLE_CACHE} from '../school-manager.module';

export const PERSONNEL_DATA_SOURCE = new InjectionToken<DataSource<Personnel>>('personnel-data-source');
export const PERSONNEL_CACHE = new InjectionToken<Cache<Personnel>>('personnel-cache');
export const PERSONNEL_URI_SUPPLIER = new InjectionToken<UriSupplier>('personnel-uri-supplier');

export function personnelProvidersFactory() {
  return [
    ...listProvidersFactory<Personnel, PersonnelDialogComponent, TableCache<Personnel>>(PERSONNEL_LIST_MENU, PERSONNEL_GROUP, 'Personnel',
      PersonnelDialogComponent, PERSONNEL_TABLE_CACHE),
    {
      provide: PERSONNEL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Personnel>) => new TableCache(dataSource),
      deps: [PERSONNEL_DATA_SOURCE]
    },
    {
      provide: PERSONNEL_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/personnel`)
    },
    PersonnelRepository,
    {
      provide: PERSONNEL_CACHE,
      useFactory: () => new Cache<Personnel>()
    },
    {
      provide: PERSONNEL_DATA_SOURCE,
      useFactory: (repository: Repository<Personnel>, cache: Cache<Personnel>) => new DataSource<Personnel>(repository, cache),
      deps: [PersonnelRepository, PERSONNEL_CACHE]
    },
  ]
}
