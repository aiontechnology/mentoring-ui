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
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {School} from '../../models/school/school';
import {SchoolRepository} from '../../implementation/repositories/school-repository';
import {SCHOOL_ID} from '../../implementation/route/route-constants';
import {RouteElementWatcher} from '../../implementation/route/route-element-watcher.service';
import {MultiItemCache} from '../../implementation/state-management/multi-item-cache';
import {PersistentSingleItemCache} from '../../implementation/state-management/persistent-single-item-cache';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from '../../implementation/state-management/single-item-cache-updater';

export const SCHOOL_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-uri-supplier');
export const SCHOOL_CACHE = new InjectionToken<Cache<School>>('school-cache');
export const SCHOOL_DATA_SOURCE = new InjectionToken<DataSource<School>>('school-data-source');
export const SCHOOL_INSTANCE_CACHE = new InjectionToken<SingleItemCache<School>>('school-instance-cache')
export const SCHOOL_INSTANCE_CACHE_UPDATER = new InjectionToken<SingleItemCacheUpdater<School>>('school-instance-cache-updater')
export const SCHOOL_COLLECTION_CACHE = new InjectionToken<MultiItemCache<School>>('school-collection-cache')
export const SCHOOL_ROUTE_WATCHER = new InjectionToken<RouteElementWatcher<School>>('school-route-watcher')

export function globalSchoolProvidersFactory() {
  return [
    {
      provide: SCHOOL_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools`)
    },
    SchoolRepository,
    {
      provide: SCHOOL_CACHE,
      useFactory: () => new Cache<School>('SchoolCache')
    },
    {
      provide: SCHOOL_DATA_SOURCE,
      useFactory: (repository: Repository<School>, cache: Cache<School>) => new DataSource(repository, cache),
      deps: [SchoolRepository, SCHOOL_CACHE]
    },
    {
      provide: SCHOOL_INSTANCE_CACHE,
      useFactory: () => new PersistentSingleItemCache<School>('SchoolInstanceCache')
    },
    {
      provide: SCHOOL_INSTANCE_CACHE_UPDATER,
      useFactory: (singleItemCache: SingleItemCache<School>, dataSource: DataSource<School>) =>
        new SingleItemCacheUpdater<School>(singleItemCache, dataSource),
      deps: [SCHOOL_INSTANCE_CACHE, SCHOOL_DATA_SOURCE]
    },
    {
      provide: SCHOOL_COLLECTION_CACHE,
      useFactory: (dataSource: DataSource<School>) => new MultiItemCache<School>('SchoolCollectionCache', dataSource),
      deps: [SCHOOL_DATA_SOURCE]
    },
    {
      provide: SCHOOL_ROUTE_WATCHER,
      useFactory: (schoolInstanceCacheUpdater: SingleItemCacheUpdater<School>) =>
        new RouteElementWatcher<School>(schoolInstanceCacheUpdater, SCHOOL_ID),
      deps: [SCHOOL_INSTANCE_CACHE_UPDATER]
    }
  ]
}
