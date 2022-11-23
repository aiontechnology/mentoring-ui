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
import {School} from '../../models/school/school';
import {Publisher} from './publisher';
import {SingleItemCache} from './single-item-cache';

/**
 * Subscribes to a provided SingleItemCache<School> to respond to school changes. When a school change is detected,
 * the provided Cache is reset and the event is published to observers.
 */
export class SchoolChangeDataSourceResetter<T> extends Publisher<School> {
  private subscriptions: Subscription[] = []

  constructor(
    private label: string,
    private schoolInstanceCache: SingleItemCache<School>,
    private cache: Cache<T>,
  ) {
    super()
  }

  start(): void {
    this.subscriptions.push(this.schoolInstanceCache.observable.subscribe(this.onSchoolChange))
  }

  stop(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  private onSchoolChange = (school: School) => {
    if (school) {
      console.log(`${this.label}: Resetting cache`)
      this.cache.reset()
      this.publish(school)
    } else {
      console.log(`${this.label}: School changed to null (ignoring)`)
    }
  }
}
