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

import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {SingleItemCacheUpdater} from '../state-management/single-item-cache-updater';

export class RouteElementWatcher<T> {
  constructor(
    private itemCache: SingleItemCacheUpdater<T>,
    private itemKey: string,
  ) {
  }

  watch(route: ActivatedRoute, label?: string): Subscription {
    console.warn('Establishing route watch', label, this.itemKey)
    return route.paramMap
      .subscribe(params => {
        const id = params.get(this.itemKey)
        if (id) {
          console.log('RouteElementWatcher: updating from id', label, id)
          this.itemCache.fromId(id)
            .then(item => console.log('Choose item', item))
        } else {
          console.warn('RouteElementWatcher: ignored update attempt', label, this.itemKey)
        }
      })
  }

}
