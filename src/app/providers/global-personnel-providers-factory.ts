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
import {environment} from '../../environments/environment';
import {Cache} from '../implementation/data/cache';
import {DataSource} from '../implementation/data/data-source';
import {Repository} from '../implementation/data/repository';
import {UriSupplier} from '../implementation/data/uri-supplier';
import {Personnel} from '../implementation/models/personnel/personnel';
import {PersonnelRepository} from '../implementation/repositories/personnel-repository';
import {SingleItemCache} from '../implementation/state-management/single-item-cache';

export const PERSONNEL_DATA_SOURCE = new InjectionToken<DataSource<Personnel>>('personnel-data-source');
export const PERSONNEL_CACHE = new InjectionToken<Cache<Personnel>>('personnel-cache');
export const PERSONNEL_URI_SUPPLIER = new InjectionToken<UriSupplier>('personnel-uri-supplier');
export const PERSONNEL_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Personnel>>('personnel-instance-cache')

export function globalPersonnelProvidersFactory() {
  return [
    {
      provide: PERSONNEL_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/personnel`)
    },
    PersonnelRepository,
    {
      provide: PERSONNEL_CACHE,
      useFactory: () => new Cache<Personnel>('PersonnelCache')
    },
    {
      provide: PERSONNEL_DATA_SOURCE,
      useFactory: (repository: Repository<Personnel>, cache: Cache<Personnel>) => new DataSource<Personnel>(repository, cache),
      deps: [PersonnelRepository, PERSONNEL_CACHE]
    },
    {
      provide: PERSONNEL_INSTANCE_CACHE,
      useFactory: () => new SingleItemCache<Personnel>('PersonnelInstanceCache')
    },
  ]
}
