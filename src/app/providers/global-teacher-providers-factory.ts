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
import {Teacher} from '../implementation/models/teacher/teacher';
import {TeacherRepository} from '../implementation/repositories/teacher-repository';
import {MultiItemCache} from '../implementation/state-management/multi-item-cache';
import {MultiItemCacheSchoolChangeLoader} from '../implementation/state-management/multi-item-cache-school-change-loader';
import {SchoolChangeDataSourceResetter} from '../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCache} from '../implementation/state-management/single-item-cache';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const TEACHER_URI_SUPPLIER = new InjectionToken<UriSupplier>('teacher-uri-supplier');
export const TEACHER_CACHE = new InjectionToken<Cache<Teacher>>('teacher-cache');
export const TEACHER_DATA_SOURCE = new InjectionToken<DataSource<Teacher>>('teacher-data-source');
export const TEACHER_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Teacher>>('teacher-instance-cache')
export const TEACHER_COLLECTION_CACHE = new InjectionToken<MultiItemCache<Teacher>>('teacher-collection-cache')
export const TEACHER_COLLECTION_CACHE_LOADER = new InjectionToken<MultiItemCacheSchoolChangeLoader<Teacher>>('teacher-collection-cache-loader')
export const TEACHER_SCHOOL_CHANGE_RESETTER = new InjectionToken<SchoolChangeDataSourceResetter<Teacher>>('teacher-school-change-resetter')

export function globalTeacherProvidersFactory() {
  return [
    {
      provide: TEACHER_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/teachers`)
    },
    TeacherRepository,
    {
      provide: TEACHER_CACHE,
      useFactory: () => new Cache<Teacher>('TeacherCache')
    },
    {
      provide: TEACHER_DATA_SOURCE,
      useFactory: (repository: Repository<Teacher>, cache: Cache<Teacher>) => new DataSource<Teacher>(repository, cache),
      deps: [TeacherRepository, TEACHER_CACHE]
    },
    {
      provide: TEACHER_INSTANCE_CACHE,
      useFactory: () => new SingleItemCache<Teacher>('TeacherInstanceCache')
    },
    {
      provide: TEACHER_COLLECTION_CACHE,
      useFactory: (dataSource: DataSource<Teacher>) => new MultiItemCache<Teacher>('TeacherCollectionCache', dataSource),
      deps: [TEACHER_DATA_SOURCE]
    },
    {
      provide: TEACHER_SCHOOL_CHANGE_RESETTER,
      useFactory: (schoolInstanceCache: SingleItemCache<School>, cache: Cache<Teacher>) =>
        new SchoolChangeDataSourceResetter('TeacherSchoolChangeResetter', schoolInstanceCache, cache),
      deps: [SCHOOL_INSTANCE_CACHE, TEACHER_CACHE]
    },
    {
      provide: TEACHER_COLLECTION_CACHE_LOADER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<Teacher>, teacherCollectionCache: MultiItemCache<Teacher>, uriSupplier: UriSupplier) =>
        new MultiItemCacheSchoolChangeLoader<Teacher>('TeacherCollectionCacheLoader', schoolChangeResetter, uriSupplier, teacherCollectionCache),
      deps: [TEACHER_SCHOOL_CHANGE_RESETTER, TEACHER_COLLECTION_CACHE, TEACHER_URI_SUPPLIER]
    },
  ]
}
