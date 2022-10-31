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
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {School} from '../../../implementation/models/school/school';
import {Teacher} from '../../../implementation/models/teacher/teacher';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {SCHOOL_INSTANCE_CACHE} from '../../../providers/global-school-providers-factory';
import {TEACHER_CACHE, TEACHER_DATA_SOURCE, TEACHER_URI_SUPPLIER} from '../../../providers/global-teacher-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {TeacherDialogComponent} from '../components/school-detail-tabs/teacher-dialog/teacher-dialog.component';
import {TEACHER_GROUP, TEACHER_LIST_MENU} from '../school-manager.module';

export const TEACHER_TABLE_CACHE = new InjectionToken<TableCache<School>>('teacher-table-cache')
export const TEACHER_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Teacher>>('teacher-school-change-handler')

export function teacherProvidersFactory() {
  return [
    ...listProvidersFactory<Teacher, TeacherDialogComponent, TableCache<Teacher>>(TEACHER_LIST_MENU, TEACHER_GROUP, 'Teacher',
      TeacherDialogComponent, TEACHER_TABLE_CACHE),
    {
      provide: TEACHER_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Teacher>) => new TableCache('TeacherTableCache', dataSource),
      deps: [TEACHER_DATA_SOURCE]
    },
    {
      provide: TEACHER_SCHOOL_CHANGE_HANDLER,
      useFactory: (instanceCache: SingleItemCache<School>, uriSupplier: UriSupplier, cache: Cache<Teacher>, tableCache: TableCache<Teacher>) =>
        new SingleItemCacheSchoolChangeHandler<Teacher>('TeacherSchoolChangeHandler', instanceCache, uriSupplier, cache, tableCache),
      deps: [SCHOOL_INSTANCE_CACHE, TEACHER_URI_SUPPLIER, TEACHER_CACHE, TEACHER_TABLE_CACHE]
    },
  ]
}
