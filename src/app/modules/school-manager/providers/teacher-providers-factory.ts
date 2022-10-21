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
import {environment} from '../../../../environments/environment';
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {Repository} from '../../../implementation/data/repository';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {TeacherDialogComponent} from '../components/teacher-dialog/teacher-dialog.component';
import {Teacher} from '../models/teacher/teacher';
import {TeacherRepository} from '../repositories/teacher-repository';
import {TEACHER_GROUP, TEACHER_LIST_MENU, TEACHER_TABLE_CACHE} from '../school-manager.module';

export const TEACHER_DATA_SOURCE = new InjectionToken<DataSource<Teacher>>('teacher-data-source');
export const TEACHER_CACHE = new InjectionToken<Cache<Teacher>>('teacher-cache');
export const TEACHER_URI_SUPPLIER = new InjectionToken<UriSupplier>('teacher-uri-supplier');

export function teacherProvidersFactory() {
  return [
    ...listProvidersFactory<Teacher, TeacherDialogComponent, TableCache<Teacher>>(TEACHER_LIST_MENU, TEACHER_GROUP, 'Teacher',
      TeacherDialogComponent, TEACHER_TABLE_CACHE),
    {
      provide: TEACHER_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Teacher>) => new TableCache(dataSource),
      deps: [TEACHER_DATA_SOURCE]
    },
    {
      provide: TEACHER_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/teachers`)
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
  ]
}
