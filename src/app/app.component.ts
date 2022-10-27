/*
 * Copyright 2020-2022 Aion Technology LLC
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

import {Component, Inject} from '@angular/core';
import {SingleItemCache} from './implementation/data/single-item-cache';
import {School} from './implementation/models/school/school';
import {UserSessionService} from './implementation/services/user-session.service';
import {SCHOOL_INSTANCE_CACHE} from './providers/global-school-providers-factory';

@Component({
  selector: 'ms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mentorsuccess-ui';

  constructor(
    userSession: UserSessionService,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>
  ) {
    if (userSession.isProgAdmin && schoolInstanceCache.isEmpty) {
      schoolInstanceCache.fromId(userSession.schoolUUID)
    }
  }
}
