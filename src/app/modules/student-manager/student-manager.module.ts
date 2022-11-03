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
import {Command} from '../../implementation/command/command';
import {SCHOOL_ID, STUDENT_ID} from '../../implementation/route/route-constants';
import {TeacherGradeFilterPipe} from '../shared/pipes/teacher-grade-filter.pipe';
import {SharedModule} from '../shared/shared.module';
import {StudentDetailContainerComponent} from './components/student-detail-container/student-detail-container.component';
import {StudentContactsComponent} from './components/student-detail-tabs/student-contacts/student-contacts.component';
import {StudentDetailComponent} from './components/student-detail-tabs/student-detail/student-detail.component';
import {StudentLpgComponent} from './components/student-detail-tabs/student-lpg/student-lpg.component';
import {StudentTeacherInputComponent} from './components/student-detail-tabs/student-teacher-input/student-teacher-input.component';
import {StudentDialogComponent} from './components/student-dialog/student-dialog.component';
import {StudentListComponent} from './components/student-list/student-list.component';
import {ScrollToDirective} from './directives/scroll-to.directive';
import {studentProvidersFactory} from './providers/student-providers-factory';
import {LpgRepositoryService} from './services/lpg/lpg-repository.service';
import {StudentManagerComponent} from './student-manager.component';

const routes: Routes = [
  {
    path: '', component: StudentManagerComponent, children: [
      {path: '', component: StudentListComponent},
      {path: `schools/:${SCHOOL_ID}`, component: StudentListComponent},
      {path: `schools/:${SCHOOL_ID}/students/:${STUDENT_ID}`, component: StudentDetailContainerComponent},
      {path: `students/:${STUDENT_ID}`, component: StudentDetailComponent},
    ]
  }
]

// Menus
export const STUDENT_DETAIL_MENU = new InjectionToken<Command[]>('student-detail-menu')
export const STUDENT_LIST_MENU = new InjectionToken<Command[]>('student-list-menu')

// Groups
export const STUDENT_GROUP = 'student'

@NgModule({
  declarations: [
    ScrollToDirective,
    StudentContactsComponent,
    StudentDetailContainerComponent,
    StudentDetailComponent,
    StudentListComponent,
    StudentLpgComponent,
    StudentManagerComponent,
    StudentTeacherInputComponent,
    TeacherGradeFilterPipe,
    StudentDialogComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [
    ...studentProvidersFactory(),
    LpgRepositoryService,
  ]
})
export class StudentManagerModule {
}
