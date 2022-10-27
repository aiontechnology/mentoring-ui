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

import {BehaviorSubject, Observable} from 'rxjs';
import {School} from '../models/school/school';
import {SCHOOL_ID} from '../route/route-constants';
import {SingleItemCache} from './single-item-cache';
import {URI, UriSupplier} from './uri-supplier';

export class SchoolUriSupplier extends UriSupplier {
  private uriSubject: BehaviorSubject<URI> = new BehaviorSubject<URI>(null)

  constructor(
    base: string,
    schoolInstanceCache: SingleItemCache<School>
  ) {
    super(base);
    schoolInstanceCache.observable.subscribe(this.onSchoolChange)
  }

  get observable(): Observable<URI> {
    return this.uriSubject
  }

  private onSchoolChange = (school: School): void => {
    if (school) {
      console.log('Setting school on UriSupplier', school)
      this.withSubstitution(SCHOOL_ID, school.id)
      this.uriSubject.next(this.apply())
    } else {
      this.removeSubstitution(SCHOOL_ID)
      this.uriSubject.next(null)
    }
  }

}
