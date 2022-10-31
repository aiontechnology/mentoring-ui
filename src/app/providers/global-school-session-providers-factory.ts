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
import {School} from '../implementation/models/school/school';
import {SchoolSession} from '../implementation/models/school/schoolsession';
import {SchoolSessionRepository} from '../implementation/repositories/school-session-repository';
import {MultiItemCache} from '../implementation/state-management/multi-item-cache';
import {MultiItemCacheSchoolChangeHandler} from '../implementation/state-management/multi-item-cache-school-change-handler';
import {SingleItemCache} from '../implementation/state-management/single-item-cache';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const SCHOOL_SESSION_DATA_SOURCE = new InjectionToken<DataSource<SchoolSession>>('school-session-data-source');
export const SCHOOL_SESSION_CACHE = new InjectionToken<Cache<SchoolSession>>('school-session-cache');
export const SCHOOL_SESSION_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-session-uri-supplier');
export const SCHOOL_SESSION_INSTANCE_CACHE = new InjectionToken<SingleItemCache<SchoolSession>>('school-session-instance-cache')
export const SCHOOL_SESSION_COLLECTION_CACHE = new InjectionToken<MultiItemCache<SchoolSession>>('school-session-collection-cache')
export const SCHOOL_SESSION_COLLECTION_CACHE_LOADER = new InjectionToken<MultiItemCacheSchoolChangeHandler>('school-session-collection-cache-loader')

export function globalSchoolSessionProvidersFactory() {
  return [
    {
      provide: SCHOOL_SESSION_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/schoolsessions`)
    },
    SchoolSessionRepository,
    {
      provide: SCHOOL_SESSION_DATA_SOURCE,
      useFactory: (repository: Repository<SchoolSession>, cache: Cache<SchoolSession>) => new DataSource(repository, cache),
      deps: [SchoolSessionRepository, SCHOOL_SESSION_CACHE]
    },
    {
      provide: SCHOOL_SESSION_CACHE,
      useFactory: () => new Cache<SchoolSession>('SchoolSessionCache')
    },
    {
      provide: SCHOOL_SESSION_INSTANCE_CACHE,
      useFactory: () => new SingleItemCache<SchoolSession>('SchoolSessionInstanceCache')
    },
    {
      provide: SCHOOL_SESSION_COLLECTION_CACHE,
      useFactory: (dataSource: DataSource<SchoolSession>) => new MultiItemCache<SchoolSession>(dataSource),
      deps: [SCHOOL_SESSION_DATA_SOURCE]
    },
    {
      provide: SCHOOL_SESSION_COLLECTION_CACHE_LOADER,
      useFactory: (schoolInstanceCache: SingleItemCache<School>,
                   schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
                   uriSupplier: UriSupplier,
                   dataCache: Cache<SchoolSession>,
                   schoolSessionCollectionCache
      ) =>
        new MultiItemCacheSchoolChangeHandler(
          'SchoolSessionCollectionCacheLoader',
          schoolInstanceCache,
          schoolSessionInstanceCache,
          uriSupplier,
          dataCache,
          schoolSessionCollectionCache
        ),
      deps: [SCHOOL_INSTANCE_CACHE,
        SCHOOL_SESSION_INSTANCE_CACHE,
        SCHOOL_SESSION_URI_SUPPLIER,
        SCHOOL_SESSION_CACHE,
        SCHOOL_SESSION_COLLECTION_CACHE]
    }
  ]
}
