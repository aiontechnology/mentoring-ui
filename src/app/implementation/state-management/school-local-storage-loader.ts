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
import {SCHOOL_INSTANCE_CACHE} from '../../providers/global/global-school-providers-factory';
import {School} from '../../models/school/school';
import {UserSessionService} from '../services/user-session.service';
import {SingleItemCache} from './single-item-cache';

@Injectable()
export class SchoolLocalStorageLoader {
  constructor(
    @Inject(SCHOOL_INSTANCE_CACHE )private schoolInstanceCache: SingleItemCache<School>
  ) {
    if (this.schoolInstanceCache.isEmpty) {
      const schoolJson: string = localStorage.getItem('SchoolInstanceCache')
      const school: School = new School(JSON.parse(schoolJson))
      if(school?.id) {
        this.schoolInstanceCache.item = school
      } else {
        localStorage.removeItem(UserSessionService.SCHOOL_KEY)
      }
    }
  }
}
