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
import { SchoolmanagerComponent } from './schoolmanager.component';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from '../shared/material.module';
import { MainContentComponent } from './components/main-content/main-content.component';
import { HttpClientModule } from '@angular/common/http';
import { SchoolService } from './services/school.service';
import { NewSchoolDialogComponent } from './components/new-school-dialog/new-school-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes = [
  {
    path: '', component: SchoolmanagerComponent,
    children: [
      { path: '', component: MainContentComponent }
    ]
  }
];

@NgModule({
  declarations: [
    SchoolmanagerComponent,
    SidenavComponent,
    ToolbarComponent,
    MainContentComponent,
    NewSchoolDialogComponent],
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
    SchoolService
  ]
})
export class SchoolmanagerModule { }
