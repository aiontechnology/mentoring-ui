/*
 * Copyright 2020-2024 Aion Technology LLC
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
import {Command} from '@implementation/command/command';
import {DialogManager} from '@implementation/command/dialog-manager';
import {SCHOOL_ID} from '@implementation/route/route-constants';
import {RequestPostAssessmentComponent} from '@modules-school-manager/components/request-post-assessment/request-post-assessment.component';
import {SchoolDetailContainerComponent} from '@modules-school-manager/components/school-detail-container/school-detail-container.component';
import {PersonnelDialogComponent} from '@modules-school-manager/components/school-detail-tabs/personnel-dialog/personnel-dialog.component';
import {PersonnelListComponent} from '@modules-school-manager/components/school-detail-tabs/personnel-list/personnel-list.component';
import {
  ProgramAdminDetailComponent
} from '@modules-school-manager/components/school-detail-tabs/program-admin-detail/program-admin-detail.component';
import {
  ProgramAdminDialogComponent
} from '@modules-school-manager/components/school-detail-tabs/program-admin-dialog/program-admin-dialog.component';
import {
  SchoolBookDialogComponent
} from '@modules-school-manager/components/school-detail-tabs/school-book-dialog/school-book-dialog.component';
import {SchoolBookListComponent} from '@modules-school-manager/components/school-detail-tabs/school-book-list/school-book-list.component';
import {SchoolDetailComponent} from '@modules-school-manager/components/school-detail-tabs/school-detail/school-detail.component';
import {
  SchoolGameDialogComponent
} from '@modules-school-manager/components/school-detail-tabs/school-game-dialog/school-game-dialog.component';
import {SchoolGameListComponent} from '@modules-school-manager/components/school-detail-tabs/school-game-list/school-game-list.component';
import {TeacherDialogComponent} from '@modules-school-manager/components/school-detail-tabs/teacher-dialog/teacher-dialog.component';
import {TeacherListComponent} from '@modules-school-manager/components/school-detail-tabs/teacher-list/teacher-list.component';
import {SchoolDialogComponent} from '@modules-school-manager/components/school-dialog/school-dialog.component';
import {SchoolListComponent} from '@modules-school-manager/components/school-list/school-list.component';
import {
  SchoolSessionDialogComponent
} from '@modules-school-manager/components/school-session/school-session-dialog/school-session-dialog.component';
import {
  SchoolSessionDisplayComponent
} from '@modules-school-manager/components/school-session/school-session-display/school-session-display.component';
import {personnelProvidersFactory} from '@modules-school-manager/providers/personnel-providers-factory';
import {programAdminProvidersFactory} from '@modules-school-manager/providers/program-admin-providers-factory';
import {schoolBookProvidersFactory} from '@modules-school-manager/providers/school-book-providers-factory';
import {schoolGameProvidersFactory} from '@modules-school-manager/providers/school-game-providers-factory';
import {SCHOOL_SESSION_ADD_DIALOG_MANAGER, schoolProvidersFactory} from '@modules-school-manager/providers/school-providers-factory';
import {teacherProvidersFactory} from '@modules-school-manager/providers/teacher-providers-factory';
import {SchoolManagerComponent} from '@modules-school-manager/school-manager.component';
import {InviteStudentComponent} from '@modules-shared/components/invite-student/invite-student.component';
import {SharedModule} from '@modules-shared/shared.module';
import {standAloneDialogManagerProviders} from '@providers/dialog/stand-alone-dialog-manager-providers';

const routes: Routes = [
  {
    path: '', component: SchoolManagerComponent, children: [
      {path: '', component: SchoolListComponent},
      {path: `schools/:${SCHOOL_ID}`, component: SchoolDetailContainerComponent}
    ],
  }
]

// Menus
export const SCHOOL_BOOK_LIST_MENU = new InjectionToken<Command[]>('school-book-list-menu')
export const SCHOOL_GAME_LIST_MENU = new InjectionToken<Command[]>('school-game-list-menu')
export const SCHOOL_LIST_MENU = new InjectionToken<Command[]>('school-list-menu')
export const PERSONNEL_LIST_MENU = new InjectionToken<Command[]>('personnel-list-menu')

// Groups
export const PERSONNEL_GROUP = 'personnel'
export const PROGRAM_ADMIN_GROUP = 'program-admin-detail'
export const SCHOOL_BOOK_GROUP = 'school-book'
export const SCHOOL_GAME_GROUP = 'school-game'
export const TEACHER_GROUP = 'teacher'

export const POST_ASSESSMENT_DIALOG_MANAGER = new InjectionToken<DialogManager<RequestPostAssessmentComponent>>('post-assessment-dialog-manager')

@NgModule({
  declarations: [
    InviteStudentComponent,
    PersonnelListComponent,
    ProgramAdminDialogComponent,
    SchoolBookDialogComponent,
    SchoolBookListComponent,
    SchoolDetailContainerComponent,
    SchoolDetailComponent,
    SchoolDialogComponent,
    SchoolGameDialogComponent,
    SchoolGameListComponent,
    SchoolListComponent,
    SchoolManagerComponent,
    SchoolSessionDialogComponent,
    SchoolSessionDisplayComponent,
    TeacherDialogComponent,
    TeacherListComponent,
    PersonnelDialogComponent,
    ProgramAdminDetailComponent,
    RequestPostAssessmentComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
    ...personnelProvidersFactory(),
    ...programAdminProvidersFactory(),
    ...schoolBookProvidersFactory(),
    ...schoolGameProvidersFactory(),
    ...schoolProvidersFactory(),
    ...teacherProvidersFactory(),
    ...standAloneDialogManagerProviders<SchoolSessionDialogComponent>(SCHOOL_SESSION_ADD_DIALOG_MANAGER, SchoolSessionDialogComponent),
    ...standAloneDialogManagerProviders<RequestPostAssessmentComponent>(POST_ASSESSMENT_DIALOG_MANAGER, RequestPostAssessmentComponent),
  ]
})
export class SchoolManagerModule {
}
