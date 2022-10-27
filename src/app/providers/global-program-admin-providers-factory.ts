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
import {SingleItemCache} from '../implementation/data/single-item-cache';
import {UriSupplier} from '../implementation/data/uri-supplier';
import {ProgramAdminRepository} from '../implementation/repositories/program-admin-repository';
import {Personnel} from '../implementation/models/personnel/personnel';
import {ProgramAdmin} from '../implementation/models/program-admin/program-admin';

export const PROGRAM_ADMIN_DATA_SOURCE = new InjectionToken<DataSource<ProgramAdmin>>('program-admin-detail-data-source');
export const PROGRAM_ADMIN_CACHE = new InjectionToken<Cache<Personnel>>('program-admin-detail-cache');
export const PROGRAM_ADMIN_URI_SUPPLIER = new InjectionToken<UriSupplier>('program-admin-detail-uri-supplier');
export const PROGRAM_ADMIN_INSTANCE_CACHE = new InjectionToken<SingleItemCache<ProgramAdmin>>('program-admin-instance-cache')

export function globalProgramAdminProvidersFactory() {
  return [
    {
      provide: PROGRAM_ADMIN_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/programAdmins`)
    },
    ProgramAdminRepository,
    {
      provide: PROGRAM_ADMIN_CACHE,
      useFactory: () => new Cache<ProgramAdmin>()
    },
    {
      provide: PROGRAM_ADMIN_DATA_SOURCE,
      useFactory: (repository: Repository<ProgramAdmin>, cache: Cache<ProgramAdmin>) => new DataSource<ProgramAdmin>(repository, cache),
      deps: [ProgramAdminRepository, PROGRAM_ADMIN_CACHE]
    },
    {
      provide: PROGRAM_ADMIN_INSTANCE_CACHE,
      useFactory: (dataSource: DataSource<ProgramAdmin>) => new SingleItemCache<ProgramAdmin>(dataSource),
      deps: [PROGRAM_ADMIN_DATA_SOURCE]
    },
  ]
}

