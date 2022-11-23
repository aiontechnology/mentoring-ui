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
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Game} from '../../../implementation/models/game/game';
import {SchoolChangeDataSourceResetter} from '../../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailDialogManagerProviders} from '../../../providers/dialog/detail-dialog-manager-providers';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {GAME_DATA_SOURCE, GAME_INSTANCE_CACHE, GAME_INSTANCE_CACHE_UPDATER} from '../../../providers/global/global-game-providers-factory';
import {
  SCHOOL_GAME_CACHE,
  SCHOOL_GAME_SCHOOL_CHANGE_RESETTER,
  SCHOOL_GAME_URI_SUPPLIER
} from '../../../providers/global/global-school-game-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {GameDialogComponent} from '../components/game-dialog/game-dialog.component';

export const GAME_DETAIL_MENU = new InjectionToken<Command[]>('game-detail-menu');
export const GAME_LIST_MENU = new InjectionToken<Command[]>('game-list-menu');
export const GAME_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Game>>('game-school-change-handler')
export const GAME_TABLE_CACHE = new InjectionToken<SingleItemCache<Game>>('game-table-cache')
export const GAME_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<GameDialogComponent>>('game-detail-edit-dialog-manager')
export const GAME_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('game-detail-delete-dialog-manager')
export const GAME_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<GameDialogComponent>>('game-list-edit-dialog-manager')
export const GAME_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('game-list-delete-dialog-manager')

export function gameProvidersFactory() {
  return [
    ...detailDialogManagerProviders(
      'game',
      GAME_DETAIL_EDIT_DIALOG_MANAGER,
      GAME_DETAIL_DELETE_DIALOG_MANAGER,
      GameDialogComponent,
      GAME_TABLE_CACHE,
      ['/resourcemanager'],
      GAME_INSTANCE_CACHE,
      GAME_INSTANCE_CACHE_UPDATER
    ),
    ...listDialogManagerProviders<Game, GameDialogComponent, TableCache<Game>>(
      'game',
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
    {
      provide: GAME_SCHOOL_CHANGE_HANDLER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<Game>, uriSupplier: UriSupplier, cache: Cache<Game>, tableCache: TableCache<Game>) =>
        new SingleItemCacheSchoolChangeHandler<Game>('GameSchoolChangeHandler', schoolChangeResetter, uriSupplier, cache, tableCache),
      deps: [SCHOOL_GAME_SCHOOL_CHANGE_RESETTER, SCHOOL_GAME_URI_SUPPLIER, SCHOOL_GAME_CACHE, GAME_TABLE_CACHE]
    },
  ]
}
