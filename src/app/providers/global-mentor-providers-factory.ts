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
import {Mentor} from '../implementation/models/mentor/mentor';
import {School} from '../implementation/models/school/school';
import {MentorRepository} from '../implementation/repositories/mentor-repository';
import {MENTOR_ID} from '../implementation/route/route-constants';
import {RouteElementWatcher} from '../implementation/route/route-element-watcher.service';
import {MultiItemCache} from '../implementation/state-management/multi-item-cache';
import {MultiItemCacheSchoolChangeLoader} from '../implementation/state-management/multi-item-cache-school-change-loader';
import {SchoolChangeDataSourceResetter} from '../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCache} from '../implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from '../implementation/state-management/single-item-cache-updater';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const MENTOR_DATA_SOURCE = new InjectionToken<DataSource<Mentor>>('mentor-data-source');
export const MENTOR_CACHE = new InjectionToken<Cache<Mentor>>('mentor-cache');
export const MENTOR_URI_SUPPLIER = new InjectionToken<UriSupplier>('mentor-uri-supplier');
export const MENTOR_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Mentor>>('mentor-instance-cache')
export const MENTOR_INSTANCE_CACHE_UPDATER = new InjectionToken<SingleItemCacheUpdater<Mentor>>('mentor-instance-cache-updater')
export const MENTOR_COLLECTION_CACHE = new InjectionToken<MultiItemCache<Mentor>>('mentor-collection-cache')
export const MENTOR_COLLECTION_CACHE_LOADER = new InjectionToken<MultiItemCacheSchoolChangeLoader<Mentor>>('mentor-collection-cache-loader')
export const MENTOR_SCHOOL_CHANGE_RESETTER = new InjectionToken<SchoolChangeDataSourceResetter<Mentor>>('mentor-school-change-resetter')
export const MENTOR_ROUTE_WATCHER = new InjectionToken<RouteElementWatcher<Mentor>>('mentor-route-watcher')

export function globalMentorProvidersFactory() {
  return [
    {
      provide: MENTOR_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/mentors`)
    },
    MentorRepository,
    {
      provide: MENTOR_CACHE,
      useFactory: () => new Cache<Mentor>('MentorCache')
    },
    {
      provide: MENTOR_DATA_SOURCE,
      useFactory: (repository: Repository<Mentor>, cache: Cache<Mentor>) => new DataSource<Mentor>(repository, cache),
      deps: [MentorRepository, MENTOR_CACHE]
    },
    {
      provide: MENTOR_INSTANCE_CACHE,
      useFactory: () => new SingleItemCache<Mentor>('MentorInstanceCache')
    },
    {
      provide: MENTOR_INSTANCE_CACHE_UPDATER,
      useFactory: (singleItemCache: SingleItemCache<Mentor>, dataSource: DataSource<Mentor>) =>
        new SingleItemCacheUpdater<Mentor>(singleItemCache, dataSource),
      deps: [MENTOR_INSTANCE_CACHE, MENTOR_DATA_SOURCE]
    },
    {
      provide: MENTOR_COLLECTION_CACHE,
      useFactory: (dataSource: DataSource<Mentor>) => new MultiItemCache<Mentor>('MentorCollectionCache', dataSource),
      deps: [MENTOR_DATA_SOURCE]
    },
    {
      provide: MENTOR_SCHOOL_CHANGE_RESETTER,
      useFactory: (schoolInstanceCache: SingleItemCache<School>, cache: Cache<Mentor>) =>
        new SchoolChangeDataSourceResetter('MentorSchoolChangeResetter', schoolInstanceCache, cache),
      deps: [SCHOOL_INSTANCE_CACHE, MENTOR_CACHE]
    },
    {
      provide: MENTOR_COLLECTION_CACHE_LOADER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<Mentor>, mentorCollectionCache: MultiItemCache<Mentor>, uriSupplier: UriSupplier) =>
        new MultiItemCacheSchoolChangeLoader<Mentor>('MentorCollectionCacheLoader', schoolChangeResetter, uriSupplier, mentorCollectionCache),
      deps: [MENTOR_SCHOOL_CHANGE_RESETTER, MENTOR_COLLECTION_CACHE, MENTOR_URI_SUPPLIER]
    },
    {
      provide: MENTOR_ROUTE_WATCHER,
      useFactory: (mentorInstanceCacheUpdator: SingleItemCacheUpdater<Mentor>) =>
        new RouteElementWatcher<Mentor>(mentorInstanceCacheUpdator, MENTOR_ID),
      deps: [MENTOR_INSTANCE_CACHE_UPDATER]
    },
  ]
}
