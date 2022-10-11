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
import {CanActivateSysAdmin} from 'src/app/services/can-activate-sys-admin';
import {Command} from '../../implementation/command/command';
import {DataSource} from '../../implementation/data/data-source';
import {SingleItemCache} from '../../implementation/data/single-item-cache';
import {TableCache} from '../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../providers/detail-menus-providers-factory';
import {listProvidersFactory} from '../../providers/list-menus-providers-factory';
import {programAdminProvidersFactory} from '../../providers/program-admin-providers-factory';
import {updateProvidersFactory} from '../../providers/update-menus-providers-factory';
import {Book} from '../shared/models/book/book';
import {Game} from '../shared/models/game/game';
import {School} from '../shared/models/school/school';
import {GradesFormatPipe} from '../shared/pipes/grades-format.pipe';
import {SchoolGameCacheService} from '../shared/services/school-resource/school-game/school-game-cache.service';
import {
  PERSONNEL_DATA_SOURCE,
  PROGRAM_ADMIN_DATA_SOURCE,
  SCHOOL_DATA_SOURCE,
  SharedModule,
  TEACHER_DATA_SOURCE
} from '../shared/shared.module';
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
import {Personnel} from './models/personnel/personnel';
import {ProgramAdmin} from './models/program-admin/program-admin';
import {Teacher} from './models/teacher/teacher';
import {SchoolManagerComponent} from './school-manager.component';
import {SchoolBookCacheService} from './services/school-book/school-book-cache.service';

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
    path: 'schools/:id', component: SchoolDetailComponent
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
export const SCHOOL_INSTANCE_CACHE = new InjectionToken<SingleItemCache<School>>('school-instance-cache')
export const PROGRAM_ADMIN_INSTANCE_CACHE = new InjectionToken<SingleItemCache<ProgramAdmin>>('program-admin-instance-cache')

@NgModule({
  declarations: [
    GradesFormatPipe,
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
    InviteStudentComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
    // Schools
    {
      provide: SCHOOL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<School>) => new TableCache(dataSource),
      deps: [SCHOOL_DATA_SOURCE]
    },
    ...listProvidersFactory<School, SchoolDialogComponent, TableCache<School>>(SCHOOL_LIST_MENU, SCHOOL_GROUP, 'School',
      SchoolDialogComponent, SCHOOL_TABLE_CACHE),
    ...detailProvidersFactory<School, SchoolDialogComponent, TableCache<School>>(SCHOOL_DETAIL_MENU, SCHOOL_GROUP, 'School',
      ['/schoolsmanager'], SchoolDialogComponent, SCHOOL_TABLE_CACHE, SCHOOL_INSTANCE_CACHE),
    {
      provide: SCHOOL_INSTANCE_CACHE,
      useFactory: (dataSource: DataSource<School>) => new SingleItemCache<School>(dataSource),
      deps: [SCHOOL_DATA_SOURCE]
    },

    // Program Administrators
    ...programAdminProvidersFactory<ProgramAdmin, ProgramAdminDialogComponent>(PROGRAM_ADMIN_MENU, PROGRAM_ADMIN_GROUP,
      'Program Admin', [], ProgramAdminDialogComponent, PROGRAM_ADMIN_INSTANCE_CACHE),
    {
      provide: PROGRAM_ADMIN_INSTANCE_CACHE,
      useFactory: (dataSource: DataSource<ProgramAdmin>) => new SingleItemCache<ProgramAdmin>(dataSource),
      deps: [PROGRAM_ADMIN_DATA_SOURCE]
    },

    // Teachers
    {
      provide: TEACHER_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Teacher>) => new TableCache(dataSource),
      deps: [TEACHER_DATA_SOURCE]
    },
    ...listProvidersFactory<Teacher, TeacherDialogComponent, TableCache<Teacher>>(TEACHER_LIST_MENU, TEACHER_GROUP, 'Teacher',
      TeacherDialogComponent, TEACHER_TABLE_CACHE),

    // Personnel
    {
      provide: PERSONNEL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Personnel>) => new TableCache(dataSource),
      deps: [PERSONNEL_DATA_SOURCE]
    },

    ...listProvidersFactory<Personnel, PersonnelDialogComponent, TableCache<Personnel>>(PERSONNEL_LIST_MENU, PERSONNEL_GROUP, 'Personnel',
      PersonnelDialogComponent, PERSONNEL_TABLE_CACHE),

    // School Books
    ...updateProvidersFactory<Book, SchoolBookDialogComponent, SchoolBookCacheService>(SCHOOL_BOOK_LIST_MENU, SCHOOL_BOOK_GROUP, 'Book',
      SchoolBookDialogComponent, SchoolBookCacheService),

    // School Games
    ...updateProvidersFactory<Game, SchoolGameDialogComponent, SchoolGameCacheService>(SCHOOL_GAME_LIST_MENU, SCHOOL_GAME_GROUP, 'Game',
      SchoolGameDialogComponent, SchoolGameCacheService),
  ]
})
export class SchoolManagerModule {
}
