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
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Book} from '../../implementation/models/book/book';
import {Game} from '../../implementation/models/game/game';
import {Personnel} from '../../implementation/models/personnel/personnel';
import {ProgramAdmin} from '../../implementation/models/program-admin/program-admin';
import {School} from '../../implementation/models/school/school';
import {Teacher} from '../../implementation/models/teacher/teacher';
import {RouteElementWatcher} from '../../implementation/route/route-element-watcher.service';
import {SingleItemCacheSchoolChangeHandler} from '../../implementation/state-management/single-item-cache-school-change-handler';
import {SCHOOL_ROUTE_WATCHER} from '../../providers/global/global-school-providers-factory';
import {PERSONNEL_SCHOOL_CHANGE_HANDLER} from './providers/personnel-providers-factory';
import {PROGRAM_ADMIN_SCHOOL_CHANGE_HANDLER} from './providers/program-admin-providers-factory';
import {SCHOOL_BOOK_SCHOOL_CHANGE_HANDLER} from './providers/school-book-providers-factory';
import {SCHOOL_GAME_SCHOOL_CHANGE_HANDLER} from './providers/school-game-providers-factory';
import {TEACHER_SCHOOL_CHANGE_HANDLER} from './providers/teacher-providers-factory';

@Component({
  selector: 'ms-school-manager',
  templateUrl: './school-manager.component.html',
  styleUrls: ['./school-manager.component.scss']
})
export class SchoolManagerComponent implements OnInit, OnDestroy {
  constructor(
    private menuState: MenuStateService,
    @Inject(SCHOOL_ROUTE_WATCHER) private schoolRouteWatcher: RouteElementWatcher<School>,
    @Inject(PERSONNEL_SCHOOL_CHANGE_HANDLER) private personnelSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<Personnel>,
    @Inject(PROGRAM_ADMIN_SCHOOL_CHANGE_HANDLER) private programAdminSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<ProgramAdmin>,
    @Inject(SCHOOL_BOOK_SCHOOL_CHANGE_HANDLER) private schoolBookSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<Book>,
    @Inject(SCHOOL_GAME_SCHOOL_CHANGE_HANDLER) private schoolGameSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<Game>,
    @Inject(TEACHER_SCHOOL_CHANGE_HANDLER) private teacherSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<Teacher>,
  ) {}

  ngOnInit(): void {
    this.menuState.title = 'School Manager'
    this.personnelSchoolChangeHandler.start()
    this.programAdminSchoolChangeHandler.start()
    this.schoolBookSchoolChangeHandler.start()
    this.schoolGameSchoolChangeHandler.start()
    this.teacherSchoolChangeHandler.start()
  }

  ngOnDestroy(): void {
    this.teacherSchoolChangeHandler.stop()
    this.schoolGameSchoolChangeHandler.stop()
    this.schoolBookSchoolChangeHandler.stop()
    this.programAdminSchoolChangeHandler.stop()
    this.personnelSchoolChangeHandler.stop()
  }
}
