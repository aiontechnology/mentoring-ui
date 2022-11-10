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
import {MenuDialogCommand} from '../../../implementation/command/menu-dialog-command';
import {DataSource} from '../../../implementation/data/data-source';
import {Mentor} from '../../../implementation/models/mentor/mentor';
import {School} from '../../../implementation/models/school/school';
import {Student} from '../../../implementation/models/student/student';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {addDialogProvidersFactory} from '../../../providers/add-dialog-providers-factory';
import {detailProvidersFactory} from '../../../providers/detail-menus-providers-factory';
import {SCHOOL_DATA_SOURCE, SCHOOL_INSTANCE_CACHE, SCHOOL_INSTANCE_CACHE_UPDATER} from '../../../providers/global-school-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {InviteStudentComponent} from '../components/invite-student/invite-student.component';
import {SchoolDialogComponent} from '../components/school-dialog/school-dialog.component';
import {SCHOOL_DETAIL_MENU, SCHOOL_GROUP, SCHOOL_LIST_MENU} from '../school-manager.module';

export const SCHOOL_TABLE_CACHE = new InjectionToken<TableCache<School>>('school-table-cache')
export const SCHOOL_INVITE_STUDENT = new InjectionToken<(dataSupplier) => MenuDialogCommand<Mentor>>('school-invite-student')

export function schoolProvidersFactory() {
  return [
    ...listProvidersFactory<School, SchoolDialogComponent, TableCache<School>>(SCHOOL_LIST_MENU, SCHOOL_GROUP, 'School',
      SchoolDialogComponent, SCHOOL_TABLE_CACHE),
    ...detailProvidersFactory<School, SchoolDialogComponent, TableCache<School>>(SCHOOL_DETAIL_MENU, SCHOOL_GROUP, 'School',
      ['/schoolsmanager'], SchoolDialogComponent, SCHOOL_TABLE_CACHE, SCHOOL_INSTANCE_CACHE, SCHOOL_INSTANCE_CACHE_UPDATER),
    ...addDialogProvidersFactory<Student, InviteStudentComponent>(SCHOOL_INVITE_STUDENT, InviteStudentComponent),
    {
      provide: SCHOOL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<School>) => new TableCache('SchoolTableCache', dataSource),
      deps: [SCHOOL_DATA_SOURCE]
    },
  ]
}
