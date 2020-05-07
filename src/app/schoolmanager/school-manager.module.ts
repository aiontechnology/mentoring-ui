/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolManagerComponent } from './school-manager.component';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from '../shared/material.module';
import { SchoolListComponent } from './components/school-list/school-list.component';
import { HttpClientModule } from '@angular/common/http';
import { SchoolService } from './services/school/school.service';
import { SchoolDialogComponent } from './components/school-dialog/school-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchoolCacheService } from './services/school/school-cache.service';
import { ConfimationDialogComponent } from './components/confimation-dialog/confimation-dialog.component';
import { SchoolDetailComponent } from './components/school-detail/school-detail.component';
import { TeacherListComponent, GradesPipe } from './components/teacher-list/teacher-list.component';
import { TeacherService } from './services/teacher/teacher.service';

const routes = [
  {
    path: '', component: SchoolManagerComponent,
    children: [
      { path: '', component: SchoolListComponent },
      { path: 'schools/:id', component: SchoolDetailComponent }
    ]
  }
];

@NgModule({
  declarations: [
    SchoolManagerComponent,
    SidenavComponent,
    ToolbarComponent,
    SchoolListComponent,
    SchoolDialogComponent,
    ConfimationDialogComponent,
    SchoolDetailComponent,
    TeacherListComponent,
    GradesPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    SchoolService,
    SchoolCacheService,
    TeacherService
  ]
})
export class SchoolManagerModule { }
