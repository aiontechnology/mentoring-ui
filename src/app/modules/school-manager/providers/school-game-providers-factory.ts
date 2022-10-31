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
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Game} from '../../../implementation/models/game/game';
import {School} from '../../../implementation/models/school/school';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {
  SCHOOL_GAME_CACHE,
  SCHOOL_GAME_DATA_SOURCE,
  SCHOOL_GAME_URI_SUPPLIER
} from '../../../providers/global-school-game-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../providers/global-school-providers-factory';
import {updateProvidersFactory} from '../../../providers/update-menus-providers-factory';
import {SchoolGameDialogComponent} from '../components/school-detail-tabs/school-game-dialog/school-game-dialog.component';
import {SCHOOL_GAME_GROUP, SCHOOL_GAME_LIST_MENU} from '../school-manager.module';

export const SCHOOL_GAME_TABLE_CACHE = new InjectionToken<UriSupplier>('school-game-table-cache');
export const SCHOOL_GAME_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Game>>('school-game-school-change-handler')

export function schoolGameProvidersFactory() {
  return [
    ...updateProvidersFactory<Game, SchoolGameDialogComponent, TableCache<Game>>(SCHOOL_GAME_LIST_MENU, SCHOOL_GAME_GROUP, 'Game',
      SchoolGameDialogComponent, SCHOOL_GAME_TABLE_CACHE),
    {
      provide: SCHOOL_GAME_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Game>) => new TableCache('SchoolGameTableCache', dataSource),
      deps: [SCHOOL_GAME_DATA_SOURCE]
    },
    {
      provide: SCHOOL_GAME_SCHOOL_CHANGE_HANDLER,
      useFactory: (instanceCache: SingleItemCache<School>, uriSupplier: UriSupplier, cache: Cache<Game>, tableCache: TableCache<Game>) =>
        new SingleItemCacheSchoolChangeHandler<Game>('SchoolGameSchoolChangeHandler', instanceCache, uriSupplier, cache, tableCache),
      deps: [SCHOOL_INSTANCE_CACHE, SCHOOL_GAME_URI_SUPPLIER, SCHOOL_GAME_CACHE, SCHOOL_GAME_TABLE_CACHE]
    },
  ]
}
