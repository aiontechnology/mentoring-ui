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
import { MentorManagerComponent } from './mentor-manager.component';
import { MentorListComponent } from './components/mentor-list/mentor-list.component';
import { MentorRepositoryService } from './services/mentor/mentor-repository.service';
import { SharedModule } from '../shared/shared.module';
import { MentorDialogComponent } from './components/mentor-dialog/mentor-dialog.component';
import { MentorDetailComponent } from './components/mentor-detail/mentor-detail.component';

const routes: Routes = [
  {
    path: '', component: MentorManagerComponent,
    children: [
      { path: '', component: MentorListComponent },
      { path: 'schools/:schoolId/mentors/:mentorId', component: MentorDetailComponent }
    ]
  }
];

@NgModule({
  declarations: [
    MentorManagerComponent,
    MentorListComponent,
    MentorDialogComponent,
    MentorDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
    MentorRepositoryService
  ]
})
export class MentorManagerModule { }
