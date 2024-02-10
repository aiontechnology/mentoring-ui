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

import {Component, Inject} from '@angular/core';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {Cache} from '../../../../../implementation/data/cache';
import {School} from '../../../../../models/school/school';
import {SchoolSession} from '../../../../../models/school/schoolsession';
import {MultiItemCache} from '../../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global/global-school-providers-factory';
import {
  SCHOOL_SESSION_CACHE,
  SCHOOL_SESSION_COLLECTION_CACHE,
  SCHOOL_SESSION_INSTANCE_CACHE
} from '../../../../../providers/global/global-school-session-providers-factory';
import {SchoolSessionDialogComponent} from '../school-session-dialog/school-session-dialog.component';

@Component({
  selector: 'ms-school-session-display',
  templateUrl: './school-session-display.component.html',
  styleUrls: ['./school-session-display.component.scss']
})
export class SchoolSessionDisplayComponent {

  constructor(
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) private schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    @Inject(SCHOOL_SESSION_CACHE) private schoolSessionCache: Cache<SchoolSession>,
    @Inject(SCHOOL_SESSION_COLLECTION_CACHE) private schoolSessionCollectionCache: MultiItemCache<SchoolSession>,
    private dialog: MatDialog,
  ) {}

  createNewSession = (): void => {
    this.dialog.open(SchoolSessionDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {schoolId: this.schoolInstanceCache.item.id}
    }).afterClosed().subscribe(schoolSession => {
      if (schoolSession) {
        this.schoolSessionInstanceCache.item = schoolSession
        this.schoolInstanceCache.item.currentSession = schoolSession
        this.schoolSessionCache.reset()
        this.schoolSessionCollectionCache.load()
      }
    });
  }

}
