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
import {ResourceManagerComponent} from './resource-manager.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {ResourceListComponent} from './components/resource-list/resource-list.component';
import {BookDialogComponent} from './components/book-dialog/book-dialog.component';
import {GameDialogComponent} from './components/game-dialog/game-dialog.component';
import {BookListComponent} from './components/book-list/book-list.component';
import {GameListComponent} from './components/game-list/game-list.component';
import {BookDetailComponent} from './components/book-detail/book-detail.component';
import {GameDetailComponent} from './components/game-detail/game-detail.component';
import {BookCacheService} from './services/resources/book-cache.service';
import {Cache} from '../../implementation/data/cache';
import {Book} from '../shared/models/book/book';
import {DataSource} from '../../implementation/data/data-source';
import {Repository} from '../../implementation/data/repository';
import {BookRepository} from './repositories/book-repository';
import {GameCacheService} from './services/resources/game-cache.service';
import {Game} from '../shared/models/game/game';
import {GameRepository} from './repositories/game-repository';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {environment} from '../../../environments/environment';

const routes: Routes = [
  {
    path: '', component: ResourceManagerComponent,
    children: [
      {path: '', component: ResourceListComponent},
      {path: 'books/:id', component: BookDetailComponent},
      {path: 'games/:id', component: GameDetailComponent}
    ]
  }
];

@NgModule({
  declarations: [
    BookDetailComponent,
    BookDialogComponent,
    BookListComponent,
    GameDetailComponent,
    GameDialogComponent,
    GameListComponent,
    ResourceListComponent,
    ResourceManagerComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
  ]
})
export class ResourceManagerModule {
}
