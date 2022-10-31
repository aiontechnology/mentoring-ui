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

import {School} from '../models/school/school';
import {SCHOOL_ID} from '../route/route-constants';
import {SingleItemCache} from '../state-management/single-item-cache';
import {UriSupplier} from './uri-supplier';

export class SchoolUriSupplier extends UriSupplier {
  constructor(
    base: string,
    schoolInstanceCache: SingleItemCache<School>
  ) {
    super(base);
    schoolInstanceCache.observable.subscribe(school => this.onSchoolChange(school))
  }

  private onSchoolChange = (school: School): void => {
    this.reset()
    if (school) {
      this.withSubstitution(SCHOOL_ID, school.id)
    }
  }

}
