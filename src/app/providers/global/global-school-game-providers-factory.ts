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
import {environment} from '../../../environments/environment';
import {Cache} from '../../implementation/data/cache';
import {DataSource} from '../../implementation/data/data-source';
import {Repository} from '../../implementation/data/repository';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {Game} from '../../implementation/models/game/game';
import {School} from '../../implementation/models/school/school';
import {SchoolGameRepository} from '../../implementation/repositories/school-game-repository';
import {SchoolChangeDataSourceResetter} from '../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const SCHOOL_GAME_DATA_SOURCE = new InjectionToken<DataSource<Game>>('school-game-data-source');
export const SCHOOL_GAME_CACHE = new InjectionToken<Cache<Game>>('school-game-cache');
export const SCHOOL_GAME_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-game-uri-supplier');
export const SCHOOL_GAME_SCHOOL_CHANGE_RESETTER = new InjectionToken<SchoolChangeDataSourceResetter<Game>>('school-game-school-change-resetter')

export function globalSchoolGameProvidersFactory() {
  return [
    {
      provide: SCHOOL_GAME_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/games`)
    },
    SchoolGameRepository,
    {
      provide: SCHOOL_GAME_CACHE,
      useFactory: () => new Cache<Game>('SchoolGameCache')
    },
    {
      provide: SCHOOL_GAME_DATA_SOURCE,
      useFactory: (repository: Repository<Game>, cache: Cache<Game>) => new DataSource(repository, cache),
      deps: [SchoolGameRepository, SCHOOL_GAME_CACHE]
    },
    {
      provide: SCHOOL_GAME_SCHOOL_CHANGE_RESETTER,
      useFactory: (schoolInstanceCache: SingleItemCache<School>, cache: Cache<Game>) =>
        new SchoolChangeDataSourceResetter<Game>('SchoolGameSchoolChangeResetter', schoolInstanceCache, cache),
      deps: [SCHOOL_INSTANCE_CACHE, SCHOOL_GAME_CACHE]
    },
  ]
}
