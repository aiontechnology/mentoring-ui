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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BOOK_ID, GAME_ID} from '../../implementation/route/route-constants';
import {SharedModule} from '../shared/shared.module';
import {BookDetailComponent} from './components/book-detail/book-detail.component';
import {BookDialogComponent} from './components/book-dialog/book-dialog.component';
import {BookListComponent} from './components/book-list/book-list.component';
import {GameDetailComponent} from './components/game-detail/game-detail.component';
import {GameDialogComponent} from './components/game-dialog/game-dialog.component';
import {GameListComponent} from './components/game-list/game-list.component';
import {ResourceListComponent} from './components/resource-list/resource-list.component';
import {SchoolBookDialogComponent} from './components/school-book-dialog/school-book-dialog.component';
import {SchoolBookListComponent} from './components/school-book-list/school-book-list.component';
import {SchoolGameDialogComponent} from './components/school-game-dialog/school-game-dialog.component';
import {SchoolGameListComponent} from './components/school-game-list/school-game-list.component';
import {bookProvidersFactory} from './providers/book-providers-factory';
import {gameProvidersFactory} from './providers/game-providers-factory';
import {schoolBookProvidersFactory} from './providers/school-book-providers-factory';
import {schoolGameProvidersFactory} from './providers/school-game-providers-factory';
import {ResourceManagerComponent} from './resource-manager.component';

// Groups
export const BOOK_GROUP = 'book'
export const GAME_GROUP = 'game'
export const SCHOOL_BOOK_GROUP = 'school-book'
export const SCHOOL_GAME_GROUP = 'school-game'

const routes: Routes = [
  {
    path: '', component: ResourceManagerComponent, children: [
      {path: '', component: ResourceListComponent},
      {path: `books/:${BOOK_ID}`, component: BookDetailComponent},
      {path: `games/:${GAME_ID}`, component: GameDetailComponent},
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
    ResourceManagerComponent,
    SchoolBookDialogComponent,
    SchoolBookListComponent,
    SchoolGameDialogComponent,
    SchoolGameListComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [
    ...bookProvidersFactory(),
    ...gameProvidersFactory(),
    ...schoolBookProvidersFactory(),
    ...schoolGameProvidersFactory(),
  ]
})
export class ResourceManagerModule {
}
