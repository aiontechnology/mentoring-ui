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
import {Student} from '../../implementation/models/student/student';
import {
  SingleItemCacheSchoolSessionChangeHandler
} from '../../implementation/state-management/single-item-cache-school-session-change-handler';
import {STUDENT_SCHOOL_SESSION_CHANGE_HANDLER} from './providers/student-providers-factory';

@Component({
  selector: 'ms-student-manager',
  templateUrl: './student-manager.component.html',
  styleUrls: ['./student-manager.component.scss']
})
export class StudentManagerComponent implements OnInit, OnDestroy {
  constructor(
    private menuState: MenuStateService,
    @Inject(STUDENT_SCHOOL_SESSION_CHANGE_HANDLER) private studentSchoolSessionChangeHandler: SingleItemCacheSchoolSessionChangeHandler<Student>,
  ) {}

  ngOnInit(): void {
    this.menuState.title = 'Student Manager';
    this.studentSchoolSessionChangeHandler.start()
  }

  ngOnDestroy(): void {
    this.studentSchoolSessionChangeHandler.stop()
  }
}
