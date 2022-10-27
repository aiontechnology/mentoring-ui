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
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../../providers/detail-menus-providers-factory';
import {STUDENT_DATA_SOURCE, STUDENT_INSTANCE_CACHE} from '../../../providers/global-student-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {StudentDialogComponent} from '../components/student-dialog/student-dialog.component';
import {Student} from '../../../implementation/models/student/student';
import {STUDENT_DETAIL_MENU, STUDENT_GROUP, STUDENT_LIST_MENU} from '../student-manager.module';

export const STUDENT_TABLE_CACHE = new InjectionToken<TableCache<Student>>('student-table-cache')

export function studentProvidersFactory() {
  return [
    ...listProvidersFactory<Student, StudentDialogComponent, TableCache<Student>>(STUDENT_LIST_MENU, STUDENT_GROUP, 'Student',
      StudentDialogComponent, STUDENT_TABLE_CACHE),
    ...detailProvidersFactory<Student, StudentDialogComponent, TableCache<Student>>(STUDENT_DETAIL_MENU, STUDENT_GROUP, 'Student',
      ['/studentmanager'], StudentDialogComponent, STUDENT_TABLE_CACHE, STUDENT_INSTANCE_CACHE),
    {
      provide: STUDENT_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Student>) => new TableCache(dataSource),
      deps: [STUDENT_DATA_SOURCE]
    },

  ]
}
