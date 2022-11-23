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

import {Cache} from '../data/cache';
import {UriSupplier} from '../data/uri-supplier';
import {School} from '../../models/school/school';
import {SchoolSession} from '../../models/school/schoolsession';
import {SubscriptionManager} from '../reactive/subscription-manager';
import {SCHOOL_ID, SESSION_PARAM} from '../route/route-constants';
import {TableCache} from '../table-cache/table-cache';
import {SingleItemCache} from './single-item-cache';

export class SingleItemCacheSchoolSessionChangeHandler<T> extends SubscriptionManager {
  constructor(
    private label: string,
    private schoolInstanceCache: SingleItemCache<School>,
    private schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    private uriSupplier: UriSupplier,
    private dataCache: Cache<T>,
    private tableCache?: TableCache<T>,
  ) {
    super()
  }

  start(): void {
    console.log(`${this.label}: Start`)
    this.addSubscription(this.schoolInstanceCache.observable.subscribe(this.onSchoolChange))
    this.addSubscription(this.schoolSessionInstanceCache.observable.subscribe(this.onSchoolSessionChange))
  }

  stop(): void {
    this.unsubscribeFromAll()
    console.log(`${this.label}: Stop`)
  }

  private onSchoolChange = (school: School) => {
    if (school) {
      console.log(`${this.label}: School change started`, school)
      this.uriSupplier.reset()
      this.uriSupplier.withSubstitution(SCHOOL_ID, school.id)
      this.reloadSchool(school, undefined)
    } else {
      console.log(`${this.label}: School changed to null (ignoring)`)
    }
  }

  private onSchoolSessionChange = (schoolSession: SchoolSession) => {
    if (schoolSession) {
      console.log(`${this.label}: School session change started`, schoolSession)
      this.uriSupplier.withParameter(SESSION_PARAM, schoolSession.id)
      this.reloadSchool(undefined, schoolSession)
    } else {
      console.log(`${this.label}: School session changed to null (ignoring)`)
    }
  }

  private reloadSchool = (school: School, schoolSession: SchoolSession) => {
    this.dataCache.reset()
    if (this.tableCache) {
      this.tableCache.loadData()
        .then(() => console.log(`${this.label}: School or school session change completed`, school, schoolSession))
    } else {
      console.log(`${this.label}: School or school session change completed`, school, schoolSession)
    }
  }
}
