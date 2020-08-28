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
import { ResourceManagerComponent } from './resource-manager.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import { BookDialogComponent } from './components/book-dialog/book-dialog.component';
import { BookRepositoryService } from './services/resources/book-repository.service';
import { BookCacheService } from './services/resources/book-cache.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from 'src/app/shared/material.module';
import { MetaDataService } from './services/meta-data/meta-data.service';
import { GameDialogComponent } from './components/game-dialog/game-dialog.component';
import { GameRepositoryService } from './services/resources/game-repository.service';
import { GameCacheService } from './services/resources/game-cache.service';
import { BookListComponent } from './components/book-list/book-list.component';
import { GameListComponent } from './components/game-list/game-list.component';

const routes: Routes = [
  {
    path: '', component: ResourceManagerComponent,
    children: [
      { path: '', component: ResourceListComponent }
    ]
  }
];

@NgModule({
  declarations: [
    BookDialogComponent,
    ResourceListComponent,
    ResourceManagerComponent,
    GameDialogComponent,
    BookListComponent,
    GameListComponent
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
    BookCacheService,
    BookRepositoryService,
    GameCacheService,
    GameRepositoryService,
    MetaDataService
  ]
})
export class ResourceManagerModule { }
