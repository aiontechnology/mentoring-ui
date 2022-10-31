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
import {SchoolSession} from '../models/school/schoolsession';
import {SCHOOL_ID} from '../route/route-constants';
import {MultiItemCache} from './multi-item-cache';
import {SingleItemCache} from './single-item-cache';

export class MultiItemCacheSchoolChangeHandler {
  private subscriptions: Subscription[] = []

  constructor(
    private label: string,
    private schoolInstanceCache: SingleItemCache<School>,
    private schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    private uriSupplier: UriSupplier,
    private dataCache: Cache<SchoolSession>,
    private collectionCache: MultiItemCache<SchoolSession>,
  ) {}

  start(): void {
    console.log(`${this.label}: Start`)
    this.subscriptions.push(this.schoolInstanceCache.observable.subscribe(this.onSchoolChange))
  }

  stop(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    console.log(`${this.label}: Stop`)
  }

  private onSchoolChange = (school: School): void => {
    if (school) {
      this.uriSupplier.reset()
      this.uriSupplier.withSubstitution(SCHOOL_ID, school.id)
      this.reload(school)
    }
  }

  private reload = (school: School) => {
    this.dataCache.reset()
    this.collectionCache.load()
      .then(() => {
        this.collectionCache.items
          .filter(session => session.isCurrent)
          .forEach(session => this.schoolSessionInstanceCache.item = session)
      })
      .then(() => console.log(`${this.label}: Cache load complete`))
  }
}
