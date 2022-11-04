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

import {Publisher} from './publisher';
import {Resettable} from './resettable';

export class SingleItemCache<T> extends Publisher<T> implements Resettable{
  constructor(
    private label?: string
  ) {
    super()
  }

  private _item: T

  get item(): T {
    return this._item
  }

  set item(item: T) {
    console.log(`${this.label}: Received new item`, item)
    if (item === this._item) {
      console.log(`${this.label}: Duplicate value (ignoring)`, item)
      return
    }
    this._item = item
    this.publish(item)
  }

  get isEmpty(): boolean {
    return this._item === undefined || this._item === null
  }

  reset() {
    this._item = undefined
  }
}
