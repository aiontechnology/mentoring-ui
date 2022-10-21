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
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {environment} from '../../environments/environment';
import {Cache} from '../implementation/data/cache';
import {DataSource} from '../implementation/data/data-source';
import {Repository} from '../implementation/data/repository';
import {SingleItemCache} from '../implementation/data/single-item-cache';
import {UriSupplier} from '../implementation/data/uri-supplier';
import {School} from '../implementation/models/school/school';
import {SchoolRepository} from '../implementation/repositories/school-repository';
import {SchoolRouteWatcher} from '../implementation/route/school-route-watcher';

export const SCHOOL_CACHE = new InjectionToken<Cache<School>>('school-cache');
export const SCHOOL_DATA_SOURCE = new InjectionToken<DataSource<School>>('school-data-source');
export const SCHOOL_INSTANCE_CACHE = new InjectionToken<SingleItemCache<School>>('school-instance-cache')
export const SCHOOL_ROUTE_WATCHER = new InjectionToken<SchoolRouteWatcher>('school-route-watcher')
export const SCHOOL_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-uri-supplier');

export function globalSchoolProvidersFactory() {
  return [
    {
      provide: SCHOOL_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools`)
    },
    SchoolRepository,
    {
      provide: SCHOOL_CACHE,
      useFactory: () => new Cache<School>()
    },
    {
      provide: SCHOOL_DATA_SOURCE,
      useFactory: (repository: Repository<School>, cache: Cache<School>) => new DataSource(repository, cache),
      deps: [SchoolRepository, SCHOOL_CACHE]
    },
    {
      provide: SCHOOL_INSTANCE_CACHE,
      useFactory: (dataSource: DataSource<School>) => new SingleItemCache<School>(dataSource),
      deps: [SCHOOL_DATA_SOURCE]
    },
    {
      provide: SCHOOL_ROUTE_WATCHER,
      useFactory: (schoolCache: SingleItemCache<School>) =>
        new SchoolRouteWatcher(schoolCache),
      deps: [SCHOOL_INSTANCE_CACHE]
    }
  ]
}
