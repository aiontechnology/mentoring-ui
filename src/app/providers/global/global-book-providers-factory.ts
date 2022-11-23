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
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from '../../implementation/state-management/single-item-cache-updater';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {Book} from '../../models/book/book';
import {BookRepository} from '../../implementation/repositories/book-repository';

export const BOOK_DATA_SOURCE = new InjectionToken<DataSource<Book>>('book-data-source');
export const BOOK_CACHE = new InjectionToken<Cache<Book>>('book-cache');
export const BOOK_URI_SUPPLIER = new InjectionToken<UriSupplier>('book-uri-supplier');
export const BOOK_INSTANCE_CACHE = new InjectionToken<SingleItemCache<Book>>('book-instance-cache')
export const BOOK_INSTANCE_CACHE_UPDATER = new InjectionToken<SingleItemCacheUpdater<Book>>('book-instance-cache-updater')

export function globalBookProvidersFactory() {
  return [
    {
      provide: BOOK_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/books`)
    },
    BookRepository,
    {
      provide: BOOK_CACHE,
      useFactory: () => new Cache<Book>('BookCache')
    },
    {
      provide: BOOK_DATA_SOURCE,
      useFactory: (repository: Repository<Book>, cache: Cache<Book>) => new DataSource<Book>(repository, cache),
      deps: [BookRepository, BOOK_CACHE]
    },
    {
      provide: BOOK_INSTANCE_CACHE,
      useFactory: () => new SingleItemCache<Book>('BookInstanceCache')
    },
    {
      provide: BOOK_INSTANCE_CACHE_UPDATER,
      useFactory: (singleItemCache: SingleItemCache<Book>, dataSource: DataSource<Book>) =>
        new SingleItemCacheUpdater<Book>(singleItemCache, dataSource),
      deps: [BOOK_INSTANCE_CACHE, BOOK_DATA_SOURCE]
    },
  ]
}
