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
import {StudentRepository} from '../implementation/repositories/student-repository';
import {Student} from '../implementation/models/student/student';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const STUDENT_DATA_SOURCE = new InjectionToken<DataSource<Student>>('student-data-source');
export const STUDENT_CACHE = new InjectionToken<Cache<Student>>('student-cache');
export const STUDENT_URI_SUPPLIER = new InjectionToken<UriSupplier>('student-uri-supplier');
export const STUDENT_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Student>>('student-instance-cache')

export function globalStudentProvidersFactory() {
  return [
    {
      provide: STUDENT_URI_SUPPLIER,
      useFactory: (schoolInstanceCache) =>
        new SchoolUriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/students`, schoolInstanceCache),
      deps: [SCHOOL_INSTANCE_CACHE]
    },
    StudentRepository,
    {
      provide: STUDENT_CACHE,
      useFactory: () => new Cache<Student>()
    },
    {
      provide: STUDENT_DATA_SOURCE,
      useFactory: (repository: Repository<Student>, cache: Cache<Student>) => new DataSource<Student>(repository, cache),
      deps: [StudentRepository, STUDENT_CACHE]
    },
    {
      provide: STUDENT_INSTANCE_CACHE,
      useFactory: (dataSource: DataSource<Student>) => new SingleItemCache<Student>(dataSource),
      deps: [STUDENT_DATA_SOURCE]
    },
  ]
}
