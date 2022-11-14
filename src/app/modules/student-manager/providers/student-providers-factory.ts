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
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../implementation/command/menu-dialog-command';
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Mentor} from '../../../implementation/models/mentor/mentor';
import {School} from '../../../implementation/models/school/school';
import {SchoolSession} from '../../../implementation/models/school/schoolsession';
import {Student} from '../../../implementation/models/student/student';
import {Teacher} from '../../../implementation/models/teacher/teacher';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {
  SingleItemCacheSchoolSessionChangeHandler
} from '../../../implementation/state-management/single-item-cache-school-session-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {addDialogProvidersFactory} from '../../../providers/dialog/add-dialog-providers-factory';
import {detailDialogManagerProviders} from '../../../providers/dialog/detail-dialog-manager-providers';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {SCHOOL_INSTANCE_CACHE} from '../../../providers/global/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../providers/global/global-school-session-providers-factory';
import {
  STUDENT_CACHE,
  STUDENT_DATA_SOURCE,
  STUDENT_INSTANCE_CACHE,
  STUDENT_INSTANCE_CACHE_UPDATER,
  STUDENT_URI_SUPPLIER
} from '../../../providers/global/global-student-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {MentorDialogComponent} from '../components/mentor-dialog/mentor-dialog.component';
import {StudentDialogComponent} from '../components/student-dialog/student-dialog.component';
import {TeacherDialogComponent} from '../components/teacher-dialog/teacher-dialog.component';

export const STUDENT_TABLE_CACHE = new InjectionToken<TableCache<Student>>('student-table-cache')
export const STUDENT_SCHOOL_SESSION_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolSessionChangeHandler<Student>>('student-school-session-change-handler')
export const STUDENT_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<StudentDialogComponent>>('student-detail-edit-dialog-manager')
export const STUDENT_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('student-detail-delete-dialog-manager')
export const STUDENT_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<StudentDialogComponent>>('student-list-edit-dialog-manager')
export const STUDENT_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('student-list-delete-dialog-manager')
export const STUDENT_ADD_TEACHER = new InjectionToken<(dataSupplier) => MenuDialogCommand<Teacher>>('student-add-teacher')
export const STUDENT_ADD_MENTOR = new InjectionToken<(dataSupplier) => MenuDialogCommand<Mentor>>('student-add-mentor')

export function studentProvidersFactory() {
  return [
    ...detailDialogManagerProviders(
      STUDENT_DETAIL_EDIT_DIALOG_MANAGER,
      STUDENT_DETAIL_DELETE_DIALOG_MANAGER,
      StudentDialogComponent,
      STUDENT_TABLE_CACHE,
      ['/studentmanager'],
      STUDENT_INSTANCE_CACHE,
      STUDENT_INSTANCE_CACHE_UPDATER
    ),
    ...listDialogManagerProviders<Student, StudentDialogComponent, TableCache<Student>>(
      STUDENT_LIST_EDIT_DIALOG_MANAGER,
      STUDENT_LIST_DELETE_DIALOG_MANAGER,
      StudentDialogComponent,
      STUDENT_TABLE_CACHE
    ),
    ...addDialogProvidersFactory<Teacher, TeacherDialogComponent>(STUDENT_ADD_TEACHER, TeacherDialogComponent),
    ...addDialogProvidersFactory<Mentor, MentorDialogComponent>(STUDENT_ADD_MENTOR, MentorDialogComponent),
    {
      provide: STUDENT_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Student>) => new TableCache('StudentTableCache', dataSource),
      deps: [STUDENT_DATA_SOURCE]
    },
    {
      provide: STUDENT_SCHOOL_SESSION_CHANGE_HANDLER,
      useFactory: (
        schoolInstanceCache: SingleItemCache<School>,
        schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
        uriSupplier: UriSupplier,
        cache: Cache<Student>,
        tableCache: TableCache<Student>
      ) =>
        new SingleItemCacheSchoolSessionChangeHandler<Student>(
          'StudentSchoolSessionChangeHandler',
          schoolInstanceCache,
          schoolSessionInstanceCache,
          uriSupplier,
          cache,
          tableCache
        ),
      deps: [SCHOOL_INSTANCE_CACHE, SCHOOL_SESSION_INSTANCE_CACHE, STUDENT_URI_SUPPLIER, STUDENT_CACHE, STUDENT_TABLE_CACHE]
    },
  ]
}
