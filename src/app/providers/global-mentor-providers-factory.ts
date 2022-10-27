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
import {SchoolUriSupplier} from '../implementation/data/school-uri-supplier';
import {SingleItemCache} from '../implementation/data/single-item-cache';
import {UriSupplier} from '../implementation/data/uri-supplier';
import {Mentor} from '../modules/mentor-manager/models/mentor/mentor';
import {MentorRepository} from '../implementation/repositories/mentor-repository';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const MENTOR_DATA_SOURCE = new InjectionToken<DataSource<Mentor>>('mentor-data-source');
export const MENTOR_CACHE = new InjectionToken<Cache<Mentor>>('mentor-cache');
export const MENTOR_URI_SUPPLIER = new InjectionToken<UriSupplier>('mentor-uri-supplier');
export const MENTOR_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Mentor>>('mentor-instance-cache')

export function globalMentorProvidersFactory() {
  return [
    {
      provide: MENTOR_URI_SUPPLIER,
      useFactory: (schoolInstanceCache) =>
        new SchoolUriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/mentors`, schoolInstanceCache),
      deps: [SCHOOL_INSTANCE_CACHE]
    },
    MentorRepository,
    {
      provide: MENTOR_CACHE,
      useFactory: () => new Cache<Mentor>()
    },
    {
      provide: MENTOR_DATA_SOURCE,
      useFactory: (repository: Repository<Mentor>, cache: Cache<Mentor>) => new DataSource<Mentor>(repository, cache),
      deps: [MentorRepository, MENTOR_CACHE]
    },
    {
      provide: MENTOR_INSTANCE_CACHE,
      useFactory: (dataSource: DataSource<Mentor>) => new SingleItemCache<Mentor>(dataSource),
      deps: [MENTOR_DATA_SOURCE]
    },
  ]
}
