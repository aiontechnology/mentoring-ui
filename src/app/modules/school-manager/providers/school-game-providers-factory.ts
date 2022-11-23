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
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Game} from '../../../models/game/game';
import {SchoolChangeDataSourceResetter} from '../../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {updateDialogManagerProviders} from '../../../providers/dialog/update-dialog-manager-providers';
import {
  SCHOOL_GAME_CACHE,
  SCHOOL_GAME_DATA_SOURCE,
  SCHOOL_GAME_SCHOOL_CHANGE_RESETTER,
  SCHOOL_GAME_URI_SUPPLIER
} from '../../../providers/global/global-school-game-providers-factory';
import {SchoolGameDialogComponent} from '../components/school-detail-tabs/school-game-dialog/school-game-dialog.component';

export const SCHOOL_GAME_TABLE_CACHE = new InjectionToken<UriSupplier>('school-game-table-cache');
export const SCHOOL_GAME_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Game>>('school-game-school-change-handler')
export const GAME_UPDATE_DIALOG_MANAGER = new InjectionToken<DialogManager<SchoolGameDialogComponent>>('school-game-update-dialog-manager')

export function schoolGameProvidersFactory() {
  return [
    ...updateDialogManagerProviders<SchoolGameDialogComponent>(GAME_UPDATE_DIALOG_MANAGER, SchoolGameDialogComponent),
    {
      provide: SCHOOL_GAME_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Game>) => new TableCache('SchoolGameTableCache', dataSource),
      deps: [SCHOOL_GAME_DATA_SOURCE]
    },
    {
      provide: SCHOOL_GAME_SCHOOL_CHANGE_HANDLER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<Game>, uriSupplier: UriSupplier, cache: Cache<Game>, tableCache: TableCache<Game>) =>
        new SingleItemCacheSchoolChangeHandler<Game>('SchoolGameSchoolChangeHandler', schoolChangeResetter, uriSupplier, cache, tableCache),
      deps: [SCHOOL_GAME_SCHOOL_CHANGE_RESETTER, SCHOOL_GAME_URI_SUPPLIER, SCHOOL_GAME_CACHE, SCHOOL_GAME_TABLE_CACHE]
    },
  ]
}
