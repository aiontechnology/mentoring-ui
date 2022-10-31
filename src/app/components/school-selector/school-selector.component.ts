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

import {Component, Inject, OnInit} from '@angular/core';
import {DataSource} from '../../implementation/data/data-source';
import {MultiItemCache} from '../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {School} from '../../implementation/models/school/school';
import {UserSessionService} from '../../implementation/services/user-session.service';
import {SCHOOL_COLLECTION_CACHE, SCHOOL_DATA_SOURCE, SCHOOL_INSTANCE_CACHE} from '../../providers/global-school-providers-factory';

@Component({
  selector: 'ms-school-selector',
  templateUrl: './school-selector.component.html',
  styleUrls: ['./school-selector.component.scss']
})
export class SchoolSelectorComponent implements OnInit {
  compareSchools = School.compare

  constructor(
    private userSession: UserSessionService,
    @Inject(SCHOOL_DATA_SOURCE) public schoolDataSource: DataSource<School>,
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_COLLECTION_CACHE) public schoolCollectionCache: MultiItemCache<School>,
  ) {
  }

  ngOnInit(): void {
    if (this.allowStudentSelection()) {
      this.schoolCollectionCache.load()
    }
  }

  allowStudentSelection(): boolean {
    return this.userSession.isLoggedIn() && this.userSession.isSysAdmin
  }

}
