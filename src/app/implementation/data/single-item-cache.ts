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

import {Injectable} from '@angular/core';
import {Publisher} from './publisher';
import {DataSource} from './data-source';

@Injectable()
export class SingleItemCache<T> extends Publisher<T> {
  constructor(private dataSource: DataSource<T>) {
    super()
  }

  private _item: T

  get item(): T {
    return this._item
  }

  set item(item: T) {
    if(item === null) {
      throw new Error('Invalid value provided to SingleItemCache')
    }
    this._item = item
    this.publish(item)
  }

  get isEmpty(): boolean {
    return this._item === undefined || this._item === null
  }

  fromId(id: string): Promise<T> {
    return this.dataSource.oneValue(id)
      .then(item => {
        this.item = item
        return item
      })
  }

  remove(): Promise<T> {
    return this.dataSource.remove(this._item)
      .then(this.item = undefined)
  }
}
