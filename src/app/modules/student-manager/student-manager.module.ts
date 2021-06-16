/**
 * Copyright 2020 - 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StudentManagerComponent } from './student-manager.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import { LpgRepositoryService } from './services/lpg/lpg-repository.service';
import { StudentRepositoryService } from './services/student/student-repository.service';
import { TeacherRepositoryService } from 'src/app/modules/school-manager/services/teacher/teacher-repository.service';
import { TeacherGradeFilterPipe } from '../shared/pipes/teacher-grade-filter.pipe';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { MentorRepositoryService } from 'src/app/modules/mentor-manager/services/mentor/mentor-repository.service';
import { ScrollToDirective } from './directives/scroll-to.directive';
import { CanActivateSysAdmin } from 'src/app/services/can-activate-sys-admin';
import { CanActivateProgAdmin } from 'src/app/services/can-activate-prog-admin';

const routes: Routes = [
  {
    path: '', component: StudentManagerComponent, children: [
      { path: '', component: StudentListComponent },
      { path: 'schools/:schoolId', component: StudentListComponent, canActivate: [CanActivateSysAdmin] },
      { path: 'schools/:schoolId/students/:studentId', component: StudentDetailComponent, canActivate: [CanActivateSysAdmin] },
      { path: 'students/:studentId', component: StudentDetailComponent, canActivate: [CanActivateProgAdmin] }
    ]
  }
];

@NgModule({
  declarations: [
    StudentManagerComponent,
    StudentListComponent,
    StudentDialogComponent,
    TeacherGradeFilterPipe,
    StudentDetailComponent,
    ScrollToDirective
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
    StudentRepositoryService,
    LpgRepositoryService,
    TeacherRepositoryService,
    MentorRepositoryService
  ]
})
export class StudentManagerModule { }
