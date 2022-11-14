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
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {DataSource} from '../../../implementation/data/data-source';
import {Book} from '../../../implementation/models/book/book';
import {Game} from '../../../implementation/models/game/game';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailDialogManagerProviders} from '../../../providers/dialog/detail-dialog-manager-providers';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {GAME_DATA_SOURCE, GAME_INSTANCE_CACHE, GAME_INSTANCE_CACHE_UPDATER} from '../../../providers/global/global-game-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {GameDialogComponent} from '../components/game-dialog/game-dialog.component';

export const GAME_DETAIL_MENU = new InjectionToken<Command[]>('game-detail-menu');
export const GAME_LIST_MENU = new InjectionToken<Command[]>('game-list-menu');
export const GAME_TABLE_CACHE = new InjectionToken<SingleItemCache<Book>>('game-table-cache')
export const GAME_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<GameDialogComponent>>('game-detail-edit-dialog-manager')
export const GAME_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('game-detail-delete-dialog-manager')
export const GAME_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<GameDialogComponent>>('game-list-edit-dialog-manager')
export const GAME_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('game-list-delete-dialog-manager')

export function gameProvidersFactory() {
  return [
    ...detailDialogManagerProviders(
      GAME_DETAIL_EDIT_DIALOG_MANAGER,
      GAME_DETAIL_DELETE_DIALOG_MANAGER,
      GameDialogComponent,
      GAME_TABLE_CACHE,
      ['/resourcemanager'],
      GAME_INSTANCE_CACHE,
      GAME_INSTANCE_CACHE_UPDATER
    ),
    ...listDialogManagerProviders<Game, GameDialogComponent, TableCache<Game>>(
      GAME_LIST_EDIT_DIALOG_MANAGER,
      GAME_LIST_DELETE_DIALOG_MANAGER,
      GameDialogComponent,
      GAME_TABLE_CACHE
    ),
    {
      provide: GAME_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Game>) => new TableCache('GameTableCache', dataSource),
      deps: [GAME_DATA_SOURCE]
    },
  ]
}
