/*
 * Copyright 2022 Aion Technology LLC
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

import {InjectionToken} from '@angular/core';
import {Command} from '../../../implementation/command/command';
import {DataSource} from '../../../implementation/data/data-source';
import {SingleItemCache} from '../../../implementation/data/single-item-cache';
import {Book} from '../../../implementation/models/book/book';
import {Game} from '../../../implementation/models/game/game';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../../providers/detail-menus-providers-factory';
import {GAME_DATA_SOURCE, GAME_INSTANCE_CACHE} from '../../../providers/global-game-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {GameDialogComponent} from '../components/game-dialog/game-dialog.component';
import {GAME_GROUP} from '../resource-manager.module';

export const GAME_DETAIL_MENU = new InjectionToken<Command[]>('game-detail-menu');
export const GAME_LIST_MENU = new InjectionToken<Command[]>('game-list-menu');
export const GAME_TABLE_CACHE = new InjectionToken<SingleItemCache<Book>>('game-table-cache')

export function gameProvidersFactory() {
  return [
    ...listProvidersFactory<Game, GameDialogComponent, TableCache<Game>>(GAME_LIST_MENU, GAME_GROUP, 'game', GameDialogComponent,
      GAME_TABLE_CACHE),
    ...detailProvidersFactory<Game, GameDialogComponent, TableCache<Game>>(GAME_DETAIL_MENU, 'game', 'game',
      ['/resourcemanager'], GameDialogComponent, GAME_TABLE_CACHE, GAME_INSTANCE_CACHE),
    {
      provide: GAME_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Game>) => new TableCache(dataSource),
      deps: [GAME_DATA_SOURCE]
    },
  ]
}
