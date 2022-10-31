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

import {DataSource} from '../data/data-source';
import {SingleItemCache} from './single-item-cache';

export class SingleItemCacheUpdater<T> {
  constructor(
    private singleItemCache: SingleItemCache<T>,
    private dataSource: DataSource<T>,
  ) {}

  async fromId(id: string): Promise<T> {
    const item = await this.dataSource.oneValue(id)
    this.singleItemCache.item = item
    return item
  }

  async remove(): Promise<T> {
    const item = await this.dataSource.remove(this.singleItemCache.item)
    this.singleItemCache.clear()
    return item
  }
}
