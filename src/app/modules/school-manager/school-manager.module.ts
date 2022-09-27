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

import {NgModule} from '@angular/core';
import {SchoolManagerComponent} from './school-manager.component';
import {RouterModule, RouterOutlet, Routes} from '@angular/router';
import {SchoolListComponent} from './components/school-list/school-list.component';
import {SchoolDialogComponent} from './components/school-dialog/school-dialog.component';
import {SchoolDetailComponent} from './components/school-detail/school-detail.component';
import {TeacherListComponent} from './components/teacher-list/teacher-list.component';
import {TeacherDialogComponent} from './components/teacher-dialog/teacher-dialog.component';
import {GradesFormatPipe} from '../shared/pipes/grades-format.pipe';
import {SharedModule} from '../shared/shared.module';
import {ProgramAdminDialogComponent} from './components/program-admin-dialog/program-admin-dialog.component';
import {PersonnelListComponent} from './components/personnel-list/personnel-list.component';
import {PersonnelDialogComponent} from './components/personnel-dialog/personnel-dialog.component';
import {CanActivateSysAdmin} from 'src/app/services/can-activate-sys-admin';
import {ProgramAdminDetailComponent} from './components/program-admin-detail/program-admin-detail.component';
import {SchoolSessionDialogComponent} from './components/school-session-dialog/school-session-dialog.component';
import {PersonnelCacheService} from './services/personnel/personnel-cache.service';
import {SchoolCacheService} from './services/school/school-cache.service';
import {InviteStudentComponent} from './components/invite-student/invite-student.component';

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
    path: 'schools/:schoolId', component: SchoolDetailComponent
  }
];

@NgModule({
  declarations: [
    GradesFormatPipe,
    PersonnelListComponent,
    ProgramAdminDialogComponent,
    SchoolDetailComponent,
    SchoolDialogComponent,
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
    RouterOutlet,
    SharedModule.forRoot()
  ],
  providers: [
    PersonnelCacheService,
    SchoolCacheService
  ]
})
export class SchoolManagerModule {
}
