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

import {DataSource} from './data-source';
import {Publisher} from './publisher';

export class MultiItemCache<T> extends Publisher<T[]> {
  constructor(private dataSource: DataSource<T>) {
    super();
  }

  private _items: T[]

  get items(): T[] {
    return this._items
  }

  set items(items: T[]) {
    this._items = items;
    this.publish(this._items)
  }

  load() {
    this.dataSource.allValues()
      .then(items => this._items = items)
  }
}
