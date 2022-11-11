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
import {environment} from '../../../environments/environment';
import {Cache} from '../../implementation/data/cache';
import {DataSource} from '../../implementation/data/data-source';
import {Repository} from '../../implementation/data/repository';
import {Mentor} from '../../implementation/models/mentor/mentor';
import {School} from '../../implementation/models/school/school';
import {SchoolChangeDataSourceResetter} from '../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCacheUpdater} from '../../implementation/state-management/single-item-cache-updater';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {Personnel} from '../../implementation/models/personnel/personnel';
import {ProgramAdmin} from '../../implementation/models/program-admin/program-admin';
import {ProgramAdminRepository} from '../../implementation/repositories/program-admin-repository';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {MENTOR_CACHE, MENTOR_SCHOOL_CHANGE_RESETTER} from './global-mentor-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const PROGRAM_ADMIN_DATA_SOURCE = new InjectionToken<DataSource<ProgramAdmin>>('program-admin-data-source');
export const PROGRAM_ADMIN_CACHE = new InjectionToken<Cache<Personnel>>('program-admin-detail-cache');
export const PROGRAM_ADMIN_URI_SUPPLIER = new InjectionToken<UriSupplier>('program-admin-detail-uri-supplier');
export const PROGRAM_ADMIN_INSTANCE_CACHE = new InjectionToken<SingleItemCache<ProgramAdmin>>('program-admin-instance-cache')
export const PROGRAM_ADMIN_INSTANCE_CACHE_UPDATER = new InjectionToken<SingleItemCacheUpdater<ProgramAdmin>>('program-admin-instance-cache-updater')
export const PROGRAM_ADMIN_SCHOOL_CHANGE_RESETTER = new InjectionToken<SchoolChangeDataSourceResetter<ProgramAdmin>>('program-admin-school-change-resetter')

export function globalProgramAdminProvidersFactory() {
  return [
    {
      provide: PROGRAM_ADMIN_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/programAdmins`)
    },
    ProgramAdminRepository,
    {
      provide: PROGRAM_ADMIN_CACHE,
      useFactory: () => new Cache<ProgramAdmin>('ProgramAdminCache')
    },
    {
      provide: PROGRAM_ADMIN_DATA_SOURCE,
      useFactory: (repository: Repository<ProgramAdmin>, cache: Cache<ProgramAdmin>) => new DataSource<ProgramAdmin>(repository, cache),
      deps: [ProgramAdminRepository, PROGRAM_ADMIN_CACHE]
    },
    {
      provide: PROGRAM_ADMIN_INSTANCE_CACHE,
      useFactory: () => new SingleItemCache<ProgramAdmin>('ProgramAdminInstanceCache')
    },
    {
      provide: PROGRAM_ADMIN_INSTANCE_CACHE_UPDATER,
      useFactory: (singleItemCache: SingleItemCache<ProgramAdmin>, dataSource: DataSource<ProgramAdmin>) =>
        new SingleItemCacheUpdater<ProgramAdmin>(singleItemCache, dataSource),
      deps: [PROGRAM_ADMIN_INSTANCE_CACHE, PROGRAM_ADMIN_DATA_SOURCE]
    },
    {
      provide: PROGRAM_ADMIN_SCHOOL_CHANGE_RESETTER,
      useFactory: (schoolInstanceCache: SingleItemCache<School>, cache: Cache<ProgramAdmin>) =>
        new SchoolChangeDataSourceResetter('ProgramAdminSchoolChangeResetter', schoolInstanceCache, cache),
      deps: [SCHOOL_INSTANCE_CACHE, PROGRAM_ADMIN_CACHE]
    },
  ]
}

