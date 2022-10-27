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
import {Teacher} from '../implementation/models/teacher/teacher';
import {TeacherRepository} from '../implementation/repositories/teacher-repository';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const TEACHER_DATA_SOURCE = new InjectionToken<DataSource<Teacher>>('teacher-data-source');
export const TEACHER_CACHE = new InjectionToken<Cache<Teacher>>('teacher-cache');
export const TEACHER_URI_SUPPLIER = new InjectionToken<UriSupplier>('teacher-uri-supplier');
export const TEACHER_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Teacher>>('teacher-instance-cache')

export function globalTeacherProvidersFactory() {
  return [
    {
      provide: TEACHER_URI_SUPPLIER,
      useFactory: (schoolInstanceCache) =>
        new SchoolUriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/teachers`, schoolInstanceCache),
      deps: [SCHOOL_INSTANCE_CACHE]
    },
    TeacherRepository,
    {
      provide: TEACHER_CACHE,
      useFactory: () => new Cache<Teacher>()
    },
    {
      provide: TEACHER_DATA_SOURCE,
      useFactory: (repository: Repository<Teacher>, cache: Cache<Teacher>) => new DataSource<Teacher>(repository, cache),
      deps: [TeacherRepository, TEACHER_CACHE]
    },
    {
      provide: TEACHER_INSTANCE_CACHE,
      useFactory: (dataSource: DataSource<Teacher>) => new SingleItemCache<Teacher>(dataSource),
      deps: [TEACHER_DATA_SOURCE]
    },
  ]
}
