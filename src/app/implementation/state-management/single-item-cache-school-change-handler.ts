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

import {Subscription} from 'rxjs';
import {Cache} from '../data/cache';
import {UriSupplier} from '../data/uri-supplier';
import {School} from '../models/school/school';
import {SCHOOL_ID} from '../route/route-constants';
import {TableCache} from '../table-cache/table-cache';
import {SchoolChangeDataSourceResetter} from './school-change-data-source-resetter';

/**
 * Subscribes to a SchoolChangeDataSourceResetter. When an event is received from that object, the following is done:
 *
 * 1. Reset the provided UriSupplier
 * 2. Set the school id of the UriSupplier
 * 3. Reload the TableCache
 */
export class SingleItemCacheSchoolChangeHandler<T> {
  private subscriptions: Subscription[] = []

  constructor(
    private label: string,
    private schoolChangeDataSourceResetter: SchoolChangeDataSourceResetter<T>,
    private uriSupplier: UriSupplier,
    private dataCache: Cache<T>,
    private tableCache?: TableCache<T>
  ) {}

  start(): void {
    console.log(`${this.label}: Start`)
    this.subscriptions.push(this.schoolChangeDataSourceResetter.observable.subscribe(this.onSchoolChange))
  }

  stop(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    console.log(`${this.label}: Stop`)
  }

  private onSchoolChange = (school: School) => {
    if (school) {
      console.log(`${this.label}: School change started`, school)
      this.uriSupplier.reset()
      this.uriSupplier.withSubstitution(SCHOOL_ID, school.id)
      this.reload(school)
    } else {
      console.log(`${this.label}: School changed to null (ignoring)`)
    }
  }

  private reload = (school: School): void => {
    if (this.tableCache) {
      this.tableCache.loadData()
        .then(() => console.log(`${this.label}: School change completed`, school))
    } else {
      console.log(`${this.label}: School change completed`, school)
    }
  }

}
