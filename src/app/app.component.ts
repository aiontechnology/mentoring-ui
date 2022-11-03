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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {School} from './implementation/models/school/school';
import {SchoolSession} from './implementation/models/school/schoolsession';
import {Teacher} from './implementation/models/teacher/teacher';
import {UserSessionService} from './implementation/services/user-session.service';
import {MultiItemCacheSchoolChangeLoader} from './implementation/state-management/multi-item-cache-school-change-loader';
import {SchoolSessionsSchoolChangeHandler} from './implementation/state-management/school-sessions-school-change-handler';
import {SingleItemCache} from './implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from './implementation/state-management/single-item-cache-updater';
import {Mentor} from './modules/mentor-manager/models/mentor/mentor';
import {MENTOR_COLLECTION_CACHE_LOADER} from './providers/global-mentor-providers-factory';
import {SCHOOL_INSTANCE_CACHE, SCHOOL_INSTANCE_CACHE_UPDATER} from './providers/global-school-providers-factory';
import {SCHOOL_SESSION_COLLECTION_CACHE_LOADER} from './providers/global-school-session-providers-factory';
import {TEACHER_COLLECTION_CACHE_LOADER} from './providers/global-teacher-providers-factory';

@Component({
  selector: 'ms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mentorsuccess-ui';

  constructor(
    private userSession: UserSessionService,
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_INSTANCE_CACHE_UPDATER) private schoolInstanceCacheUpdater: SingleItemCacheUpdater<School>,
    @Inject(SCHOOL_SESSION_COLLECTION_CACHE_LOADER) private schoolSessionCollectionCacheLoader: SchoolSessionsSchoolChangeHandler,
    @Inject(MENTOR_COLLECTION_CACHE_LOADER) private mentorCollectionCacheLoader: MultiItemCacheSchoolChangeLoader<Mentor>,
    @Inject(TEACHER_COLLECTION_CACHE_LOADER) private teacherCollectionCacheLoader: MultiItemCacheSchoolChangeLoader<Teacher>,
  ) {}

  ngOnInit(): void {
    this.schoolSessionCollectionCacheLoader.start()
    if (this.userSession.isProgAdmin && this.schoolInstanceCache.isEmpty) {
      this.schoolInstanceCacheUpdater.fromId(this.userSession.schoolUUID)
    }

    this.mentorCollectionCacheLoader.start()
    this.teacherCollectionCacheLoader.start()
  }

  ngOnDestroy(): void {
    this.teacherCollectionCacheLoader.stop()
    this.mentorCollectionCacheLoader.stop()

    this.schoolSessionCollectionCacheLoader.stop()
  }
}
