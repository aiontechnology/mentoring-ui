/*
 * Copyright 2020-2023 Aion Technology LLC
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
import {POST_ASSESSMENT_URI_SUPPLIER_UPDATER} from '@providers/global/global-assessment-providers-factory';
import {UserLoginService} from './implementation/security/user-login.service';
import {MultiItemCache} from './implementation/state-management/multi-item-cache';
import {MultiItemCacheSchoolChangeLoader} from './implementation/state-management/multi-item-cache-school-change-loader';
import {SchoolChangeDataSourceResetter} from './implementation/state-management/school-change-data-source-resetter';
import {SchoolChangeUriSupplierHandler} from './implementation/state-management/school-change-uri-supplier-handler';
import {SchoolLocalStorageLoader} from './implementation/state-management/school-local-storage-loader';
import {SchoolSessionsSchoolChangeHandler} from './implementation/state-management/school-sessions-school-change-handler';
import {SingleItemCache} from './implementation/state-management/single-item-cache';
import {Book} from './models/book/book';
import {Game} from './models/game/game';
import {Mentor} from './models/mentor/mentor';
import {Personnel} from './models/personnel/personnel';
import {ProgramAdmin} from './models/program-admin/program-admin';
import {School} from './models/school/school';
import {Teacher} from './models/teacher/teacher';
import {INVITATION_URI_SUPPLIER_UPDATER} from './providers/global/global-invitation-providers-factory';
import {MENTOR_COLLECTION_CACHE_LOADER, MENTOR_SCHOOL_CHANGE_RESETTER} from './providers/global/global-mentor-providers-factory';
import {PERSONNEL_SCHOOL_CHANGE_RESETTER} from './providers/global/global-personnel-providers-factory';
import {PROGRAM_ADMIN_SCHOOL_CHANGE_RESETTER} from './providers/global/global-program-admin-providers-factory';
import {SCHOOL_BOOK_SCHOOL_CHANGE_RESETTER} from './providers/global/global-school-book-providers-factory';
import {SCHOOL_GAME_SCHOOL_CHANGE_RESETTER} from './providers/global/global-school-game-providers-factory';
import {SCHOOL_COLLECTION_CACHE, SCHOOL_INSTANCE_CACHE} from './providers/global/global-school-providers-factory';
import {SCHOOL_SESSION_COLLECTION_CACHE_LOADER} from './providers/global/global-school-session-providers-factory';
import {TEACHER_COLLECTION_CACHE_LOADER, TEACHER_SCHOOL_CHANGE_RESETTER} from './providers/global/global-teacher-providers-factory';

@Component({
  selector: 'ms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mentorsuccess-ui';

  constructor(
    private userLoginService: UserLoginService,
    private schoolLocalStorageLoader: SchoolLocalStorageLoader,
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_COLLECTION_CACHE) public schoolCollectionCache: MultiItemCache<School>,
    @Inject(SCHOOL_SESSION_COLLECTION_CACHE_LOADER) private schoolSessionCollectionCacheLoader: SchoolSessionsSchoolChangeHandler,
    @Inject(MENTOR_SCHOOL_CHANGE_RESETTER) private mentorSchoolChangeResetter: SchoolChangeDataSourceResetter<Mentor>,
    @Inject(PERSONNEL_SCHOOL_CHANGE_RESETTER) private personnelSchoolChangeResetter: SchoolChangeDataSourceResetter<Personnel>,
    @Inject(PROGRAM_ADMIN_SCHOOL_CHANGE_RESETTER) private programAdminSchoolChangeResetter: SchoolChangeDataSourceResetter<ProgramAdmin>,
    @Inject(SCHOOL_BOOK_SCHOOL_CHANGE_RESETTER) private schoolBookAdminSchoolChangeResetter: SchoolChangeDataSourceResetter<Book>,
    @Inject(SCHOOL_GAME_SCHOOL_CHANGE_RESETTER) private schoolGameAdminSchoolChangeResetter: SchoolChangeDataSourceResetter<Game>,
    @Inject(TEACHER_SCHOOL_CHANGE_RESETTER) private teacherAdminSchoolChangeResetter: SchoolChangeDataSourceResetter<Teacher>,
    @Inject(MENTOR_COLLECTION_CACHE_LOADER) private mentorCollectionCacheLoader: MultiItemCacheSchoolChangeLoader<Mentor>,
    @Inject(TEACHER_COLLECTION_CACHE_LOADER) private teacherCollectionCacheLoader: MultiItemCacheSchoolChangeLoader<Teacher>,
    @Inject(INVITATION_URI_SUPPLIER_UPDATER) private invitationUriSupplierUpdater: SchoolChangeUriSupplierHandler,
    @Inject(POST_ASSESSMENT_URI_SUPPLIER_UPDATER) private postAssessmentUriSupplierUpdater: SchoolChangeUriSupplierHandler,
  ) {}

  ngOnInit(): void {
    this.loadSchools()
    this.schoolSessionCollectionCacheLoader.start()

    this.mentorSchoolChangeResetter.start()
    this.personnelSchoolChangeResetter.start()
    this.programAdminSchoolChangeResetter.start()
    this.schoolBookAdminSchoolChangeResetter.start()
    this.schoolGameAdminSchoolChangeResetter.start()
    this.teacherAdminSchoolChangeResetter.start()

    this.mentorCollectionCacheLoader.start()
    this.teacherCollectionCacheLoader.start()

    this.invitationUriSupplierUpdater.start()
    this.postAssessmentUriSupplierUpdater.start()
  }

  ngOnDestroy(): void {
    this.postAssessmentUriSupplierUpdater.stop()
    this.invitationUriSupplierUpdater.stop()

    this.teacherCollectionCacheLoader.stop()
    this.mentorCollectionCacheLoader.stop()

    this.teacherAdminSchoolChangeResetter.stop()
    this.schoolGameAdminSchoolChangeResetter.stop()
    this.schoolBookAdminSchoolChangeResetter.stop()
    this.programAdminSchoolChangeResetter.stop()
    this.personnelSchoolChangeResetter.stop()
    this.mentorSchoolChangeResetter.stop()

    this.schoolSessionCollectionCacheLoader.stop()
  }

  private async loadSchools(): Promise<void> {
    if (this.userLoginService.isAuthenticated && this.userLoginService.isSystemAdmin) {
      await this.schoolCollectionCache.load()
    }
  }
}
