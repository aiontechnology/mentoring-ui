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
import {RouterModule, Routes} from '@angular/router';
import {Command} from '../../implementation/command/command';
import {DataSource} from '../../implementation/data/data-source';
import {SingleItemCache} from '../../implementation/data/single-item-cache';
import {TableCache} from '../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../providers/detail-menus-providers-factory';
import {listProvidersFactory} from '../../providers/list-menus-providers-factory';
import {Book} from '../shared/models/book/book';
import {Game} from '../shared/models/game/game';
import {School} from '../shared/models/school/school';
import {BOOK_DATA_SOURCE, GAME_DATA_SOURCE, SharedModule} from '../shared/shared.module';
import {BookDetailComponent} from './components/book-detail/book-detail.component';
import {BookDialogComponent} from './components/book-dialog/book-dialog.component';
import {BookListComponent} from './components/book-list/book-list.component';
import {GameDetailComponent} from './components/game-detail/game-detail.component';
import {GameDialogComponent} from './components/game-dialog/game-dialog.component';
import {GameListComponent} from './components/game-list/game-list.component';
import {ResourceListComponent} from './components/resource-list/resource-list.component';
import {ResourceManagerComponent} from './resource-manager.component';

const routes: Routes = [
  {
    path: '', component: ResourceManagerComponent,
    children: [
      {path: '', component: ResourceListComponent},
      {path: 'books/:id', component: BookDetailComponent},
      {path: 'games/:id', component: GameDetailComponent},
    ]
  }
];

// Menus
export const BOOK_DETAIL_MENU = new InjectionToken<Command[]>('book-detail-menu');
export const BOOK_LIST_MENU = new InjectionToken<Command[]>('book-list-menu');
export const BOOK_SINGLE_CACHE = new InjectionToken<SingleItemCache<Book>>('book-single-cache')
export const GAME_DETAIL_MENU = new InjectionToken<Command[]>('game-detail-menu');
export const GAME_LIST_MENU = new InjectionToken<Command[]>('game-list-menu');
export const GAME_SINGLE_CACHE = new InjectionToken<SingleItemCache<Book>>('game-single-cache')

// Services
export const BOOK_TABLE_CACHE = new InjectionToken<TableCache<School>>('book-table-cache')
export const GAME_TABLE_CACHE = new InjectionToken<TableCache<School>>('game-table-cache')

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
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [
    // Books
    {
      provide: BOOK_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new TableCache(dataSource),
      deps: [BOOK_DATA_SOURCE]
    },
    {
      provide: BOOK_SINGLE_CACHE,
      useFactory: (dataSource: DataSource<Book>) => new SingleItemCache<Book>(dataSource),
      deps: [BOOK_DATA_SOURCE]
    },
    ...listProvidersFactory<Book, BookDialogComponent, TableCache<Book>>(BOOK_LIST_MENU, 'book', 'book', BookDialogComponent,
      BOOK_TABLE_CACHE),
    ...detailProvidersFactory<Book, BookDialogComponent, TableCache<Book>>(BOOK_DETAIL_MENU, 'book', 'book',
      ['/resourcemanager'], BookDialogComponent, BOOK_TABLE_CACHE, BOOK_SINGLE_CACHE),

    // Games
    {
      provide: GAME_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Game>) => new TableCache(dataSource),
      deps: [GAME_DATA_SOURCE]
    },
    {
      provide: GAME_SINGLE_CACHE,
      useFactory: (dataSource: DataSource<Game>) => new SingleItemCache<Game>(dataSource),
      deps: [GAME_DATA_SOURCE]
    },
    ...listProvidersFactory<Game, GameDialogComponent, TableCache<Game>>(GAME_LIST_MENU, 'game', 'game', GameDialogComponent,
      GAME_TABLE_CACHE),
    ...detailProvidersFactory<Game, GameDialogComponent, TableCache<Game>>(GAME_DETAIL_MENU, 'game', 'game',
      ['/resourcemanager'], GameDialogComponent, GAME_TABLE_CACHE, GAME_SINGLE_CACHE),

  ]
})
export class ResourceManagerModule {
}
