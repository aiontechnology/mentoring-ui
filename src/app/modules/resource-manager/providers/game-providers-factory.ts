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
import {environment} from '../../../../environments/environment';
import {Command} from '../../../implementation/command/command';
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {Repository} from '../../../implementation/data/repository';
import {SingleItemCache} from '../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../../providers/detail-menus-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {Book} from '../../shared/models/book/book';
import {Game} from '../../shared/models/game/game';
import {School} from '../../shared/models/school/school';
import {GameDialogComponent} from '../components/game-dialog/game-dialog.component';
import {GameRepository} from '../repositories/game-repository';
import {GAME_GROUP} from '../resource-manager.module';

export const GAME_DETAIL_MENU = new InjectionToken<Command[]>('game-detail-menu');
export const GAME_LIST_MENU = new InjectionToken<Command[]>('game-list-menu');
export const GAME_SINGLE_CACHE = new InjectionToken<SingleItemCache<Book>>('game-single-cache')
export const GAME_DATA_SOURCE = new InjectionToken<DataSource<Game>>('game-data-source');
export const GAME_CACHE = new InjectionToken<Cache<Game>>('game-cache');
export const GAME_URI_SUPPLIER = new InjectionToken<UriSupplier>('game-uri-supplier');
export const GAME_TABLE_CACHE = new InjectionToken<TableCache<School>>('game-table-cache')

export function gameProvidersFactory() {
  return [
    ...listProvidersFactory<Game, GameDialogComponent, TableCache<Game>>(GAME_LIST_MENU, GAME_GROUP, 'game', GameDialogComponent,
      GAME_TABLE_CACHE),
    ...detailProvidersFactory<Game, GameDialogComponent, TableCache<Game>>(GAME_DETAIL_MENU, 'game', 'game',
      ['/resourcemanager'], GameDialogComponent, GAME_TABLE_CACHE, GAME_SINGLE_CACHE),
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
    {
      provide: GAME_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/games`)
    },
    GameRepository,
    {
      provide: GAME_CACHE,
      useFactory: () => new Cache<Game>()
    },
    {
      provide: GAME_DATA_SOURCE,
      useFactory: (repository: Repository<Game>, cache: Cache<Game>) => new DataSource<Game>(repository, cache),
      deps: [GameRepository, GAME_CACHE]
    },
  ]
}
