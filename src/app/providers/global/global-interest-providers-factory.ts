/*
 * Copyright 2023 Aion Technology LLC
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
import {InterestRepository} from '../../implementation/repositories/interest-repository';
import {MultiItemCache} from '../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {Interest} from '../../models/interest';

export const INTEREST_URI_SUPPLIER = new InjectionToken<UriSupplier>('interest-uri-supplier');
export const INTEREST_CACHE = new InjectionToken<Cache<Interest>>('interest-cache');
export const INTEREST_DATA_SOURCE = new InjectionToken<DataSource<Interest>>('interest-data-source');
export const INTEREST_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Interest>>('interest-instance-cache')
export const INTEREST_COLLECTION_CACHE = new InjectionToken<MultiItemCache<Interest>>('interest-collection-cache')

export function globalInterestProvidersFactory() {
  return [
    {
      provide: INTEREST_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/interests`)
    },
    InterestRepository,
    {
      provide: INTEREST_CACHE,
      useFactory: () => new Cache<Interest>('InterestCache')
    },
    {
      provide: INTEREST_DATA_SOURCE,
      useFactory: (repository: Repository<Interest>, cache: Cache<Interest>) => new DataSource<Interest>(repository, cache),
      deps: [InterestRepository, INTEREST_CACHE]
    },
    {
      provide: INTEREST_INSTANCE_CACHE,
      useFactory: () => new SingleItemCache<Interest>('InterestInstanceCache')
    },
    {
      provide: INTEREST_COLLECTION_CACHE,
      useFactory: (dataSource: DataSource<Interest>) => new MultiItemCache<Interest>('InterestCollectionCache', dataSource),
      deps: [INTEREST_DATA_SOURCE]
    },
  ]
}
