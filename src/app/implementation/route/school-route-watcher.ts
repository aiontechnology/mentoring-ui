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

import {Inject, Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import {SCHOOL_INSTANCE_CACHE} from '../../providers/global-school-providers-factory';
import {SingleItemCache} from '../data/single-item-cache';
import {School} from '../models/school/school';
import {SCHOOL_ID} from './route-constants';

@Injectable()
export class SchoolRouteWatcher {
  private subscription: Subscription
  private schoolSubject: BehaviorSubject<School> = new BehaviorSubject<School>(null)

  constructor(@Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,) {
  }

  watch(route: ActivatedRoute): BehaviorSubject<School> {
    this.subscription = route.paramMap
      .subscribe(params => {
        const schoolId = params.get(SCHOOL_ID)
        this.schoolCache.fromId(schoolId)
          .then(school => {
            this.schoolSubject.next(school)
            return school
          })
          .then(school => console.log('Choose school', school))
      })
    return this.schoolSubject
  }

  stop() {
    this.subscription.unsubscribe()
  }
}
