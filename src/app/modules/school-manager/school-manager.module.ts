/*
 * Copyright 2020-2022 Aion Technology LLC
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

import {InjectionToken, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanActivateSysAdmin} from 'src/app/implementation/services/can-activate-sys-admin';
import {Command} from '../../implementation/command/command';
import {SingleItemCache} from '../../implementation/data/single-item-cache';
import {School} from '../../implementation/models/school/school';
import {SCHOOL_ID} from '../../implementation/route/route-constants';
import {TableCache} from '../../implementation/table-cache/table-cache';
import {globalBookProvidersFactory} from '../../providers/global-book-providers-factory';
import {globalGameProvidersFactory} from '../../providers/global-game-providers-factory';
import {globalSchoolBookProvidersFactory} from '../../providers/global-school-book-providers-factory';
import {globalSchoolGameProvidersFactory} from '../../providers/global-school-game-providers-factory';
import {globalSchoolProvidersFactory} from '../../providers/global-school-providers-factory';
import {GradesFormatPipe} from '../shared/pipes/grades-format.pipe';
import {SharedModule} from '../shared/shared.module';
import {InviteStudentComponent} from './components/invite-student/invite-student.component';
import {PersonnelDialogComponent} from './components/personnel-dialog/personnel-dialog.component';
import {PersonnelListComponent} from './components/personnel-list/personnel-list.component';
import {ProgramAdminDetailComponent} from './components/program-admin-detail/program-admin-detail.component';
import {ProgramAdminDialogComponent} from './components/program-admin-dialog/program-admin-dialog.component';
import {SchoolBookDialogComponent} from './components/school-book-dialog/school-book-dialog.component';
import {SchoolBookListComponent} from './components/school-book-list/school-book-list.component';
import {SchoolDetailComponent} from './components/school-detail/school-detail.component';
import {SchoolDialogComponent} from './components/school-dialog/school-dialog.component';
import {SchoolGameDialogComponent} from './components/school-game-dialog/school-game-dialog.component';
import {SchoolGameListComponent} from './components/school-game-list/school-game-list.component';
import {SchoolListComponent} from './components/school-list/school-list.component';
import {SchoolSessionDialogComponent} from './components/school-session-dialog/school-session-dialog.component';
import {TeacherDialogComponent} from './components/teacher-dialog/teacher-dialog.component';
import {TeacherListComponent} from './components/teacher-list/teacher-list.component';
import {ProgramAdmin} from './models/program-admin/program-admin';
import {personnelProvidersFactory} from './providers/personnel-providers-factory';
import {programAdminProvidersFactory} from './providers/program-admin-providers-factory';
import {schoolBookProvidersFactory} from './providers/school-book-providers-factory';
import {schoolGameProvidersFactory} from './providers/school-game-providers-factory';
import {schoolProvidersFactory} from './providers/school-providers-factory';
import {schoolSessionProvidersFactory} from './providers/school-session-providers-factory';
import {teacherProvidersFactory} from './providers/teacher-providers-factory';
import {SchoolManagerComponent} from './school-manager.component';

const routes: Routes = [
  {
    path: '',
    component: SchoolManagerComponent,
    children: [
      {path: '', component: SchoolListComponent}
    ],
    canActivate: [CanActivateSysAdmin]
  },
  {
    path: `schools/:${SCHOOL_ID}`, component: SchoolDetailComponent
  }
];

// Menus
export const SCHOOL_BOOK_LIST_MENU = new InjectionToken<Command[]>('school-book-list-menu')
export const SCHOOL_GAME_LIST_MENU = new InjectionToken<Command[]>('school-game-list-menu')
export const SCHOOL_DETAIL_MENU = new InjectionToken<Command[]>('school-detail-menu')
export const SCHOOL_LIST_MENU = new InjectionToken<Command[]>('school-list-menu')
export const PERSONNEL_LIST_MENU = new InjectionToken<Command[]>('personnel-list-menu')
export const PROGRAM_ADMIN_MENU = new InjectionToken<Command[]>('program-admin-menu')
export const TEACHER_LIST_MENU = new InjectionToken<Command[]>('teacher-list-menu')

// Groups
export const PERSONNEL_GROUP = 'personnel'
export const PROGRAM_ADMIN_GROUP = 'program-admin-detail'
export const SCHOOL_BOOK_GROUP = 'school-book'
export const SCHOOL_GAME_GROUP = 'school-game'
export const SCHOOL_GROUP = 'school'
export const TEACHER_GROUP = 'teacher'

// Services
export const PERSONNEL_TABLE_CACHE = new InjectionToken<TableCache<School>>('personnel-table-cache')
export const SCHOOL_TABLE_CACHE = new InjectionToken<TableCache<School>>('school-table-cache')
export const TEACHER_TABLE_CACHE = new InjectionToken<TableCache<School>>('teacher-table-cache')

// Caches
export const PROGRAM_ADMIN_INSTANCE_CACHE = new InjectionToken<SingleItemCache<ProgramAdmin>>('program-admin-instance-cache')

@NgModule({
  declarations: [
    GradesFormatPipe,
    InviteStudentComponent,
    PersonnelListComponent,
    ProgramAdminDialogComponent,
    SchoolBookDialogComponent,
    SchoolBookListComponent,
    SchoolDetailComponent,
    SchoolDialogComponent,
    SchoolGameDialogComponent,
    SchoolGameListComponent,
    SchoolListComponent,
    SchoolManagerComponent,
    TeacherDialogComponent,
    TeacherListComponent,
    PersonnelDialogComponent,
    ProgramAdminDetailComponent,
    SchoolSessionDialogComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
    ...globalSchoolProvidersFactory(),
    ...globalBookProvidersFactory(),
    ...globalGameProvidersFactory(),
    ...globalSchoolBookProvidersFactory(),
    ...globalSchoolGameProvidersFactory(),
    ...schoolProvidersFactory(),
    ...schoolSessionProvidersFactory(),
    ...programAdminProvidersFactory(),
    ...teacherProvidersFactory(),
    ...personnelProvidersFactory(),
    ...schoolBookProvidersFactory(),
    ...schoolGameProvidersFactory(),
  ]
})
export class SchoolManagerModule {
}
