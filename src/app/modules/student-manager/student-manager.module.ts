/**
 * Copyright 2020 Aion Technology LLC
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
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { StudentManagerComponent } from './student-manager.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFrameComponent } from './components/student-frame/student-frame.component';
import { StudentCacheService } from './services/student/student-cache.service';
import { StudentRepositoryService } from './services/student/student-repository.service';

const routes: Routes = [
  {
    path: '', component: StudentManagerComponent,
    children: [
      { path: '', component: StudentFrameComponent }
    ]
  }
];

@NgModule({
  declarations: [
    StudentManagerComponent,
    StudentListComponent,
    StudentFrameComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
    StudentCacheService,
    StudentRepositoryService
  ]
})
export class StudentManagerModule { }
