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
import {DataSource} from '../../../implementation/data/data-source';
import {School} from '../../../implementation/models/school/school';
import {Teacher} from '../../../implementation/models/teacher/teacher';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {TEACHER_DATA_SOURCE} from '../../../providers/global-teacher-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {TeacherDialogComponent} from '../components/school-detail-tabs/teacher-dialog/teacher-dialog.component';
import {TEACHER_GROUP, TEACHER_LIST_MENU} from '../school-manager.module';

export const TEACHER_TABLE_CACHE = new InjectionToken<TableCache<School>>('teacher-table-cache')

export function teacherProvidersFactory() {
  return [
    ...listProvidersFactory<Teacher, TeacherDialogComponent, TableCache<Teacher>>(TEACHER_LIST_MENU, TEACHER_GROUP, 'Teacher',
      TeacherDialogComponent, TEACHER_TABLE_CACHE),
    {
      provide: TEACHER_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Teacher>) => new TableCache(dataSource),
      deps: [TEACHER_DATA_SOURCE]
    },
  ]
}
