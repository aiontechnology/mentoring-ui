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
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../../shared/material.module';
import { SchoolListComponent } from './components/school-list/school-list.component';
import { HttpClientModule } from '@angular/common/http';
import { SchoolService } from './services/school/school.service';
import { SchoolDialogComponent } from './components/school-dialog/school-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchoolCacheService } from './services/school/school-cache.service';
import { SchoolDetailComponent } from './components/school-detail/school-detail.component';
import { TeacherListComponent } from './components/teacher-list/teacher-list.component';
import { TeacherService } from './services/teacher/teacher.service';
import { TeacherDialogComponent } from './components/teacher-dialog/teacher-dialog.component';
import { GradesFormatPipe } from '../shared/pipes/grades-format.pipe';
import { TeacherCacheService } from './services/teacher/teacher-cache.service';
import { SharedModule } from '../shared/shared.module';
import { ProgramAdminListComponent } from './components/program-admin-list/program-admin-list.component';
import { ProgramAdminService } from './services/program-admin/program-admin.service';
import { ProgramAdminCacheService } from './services/program-admin/program-admin-cache.service';
import { ProgramAdminDialogComponent } from './components/program-admin-dialog/program-admin-dialog.component';

const routes: Routes = [
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
    GradesFormatPipe,
    SchoolDetailComponent,
    SchoolDialogComponent,
    SchoolListComponent,
    SchoolManagerComponent,
    TeacherDialogComponent,
    TeacherListComponent,
    ProgramAdminListComponent,
    ProgramAdminDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    ProgramAdminCacheService,
    ProgramAdminService,
    SchoolCacheService,
    SchoolService,
    TeacherCacheService,
    TeacherService
  ]
})
export class SchoolManagerModule { }
