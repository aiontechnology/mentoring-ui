/*
 * Copyright 2021-2022 Aion Technology LLC
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

import { NgModule } from '@angular/core';
import { AdminManagerComponent } from './admin-manager.component';
import { RouterModule, Routes } from '@angular/router';
import { InterestListComponent } from './components/interest-list/interest-list.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { InterestDialogComponent } from './components/interest-dialog/interest-dialog.component';
import {InterestCacheService} from './services/interests/interest-cache.service';

const routes: Routes = [
  {
    path: '',
    component: AdminManagerComponent,
    children: [
      { path: '', component: InterestListComponent }
    ]
  }
];

/**
 * This module manages the system administrator's abilities.
 */
@NgModule({
  declarations: [
    AdminManagerComponent,
    InterestListComponent,
    InterestDialogComponent
  ],
  imports: [
    SharedModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [
    InterestCacheService
  ]
})
export class AdminManagerModule { }
