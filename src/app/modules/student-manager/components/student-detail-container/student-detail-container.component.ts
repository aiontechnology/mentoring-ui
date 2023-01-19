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
import {ActivatedRoute} from '@angular/router';
import {MenuStateService} from '../../../../implementation/services/menu-state.service';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {School} from '../../../../models/school/school';
import {SchoolSession} from '../../../../models/school/schoolsession';
import {Student} from '../../../../models/student/student';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../providers/global/global-school-session-providers-factory';
import {STUDENT_INSTANCE_CACHE} from '../../../../providers/global/global-student-providers-factory';

@Component({
  selector: 'ms-student-detail-container',
  templateUrl: './student-detail-container.component.html',
  styleUrls: ['./student-detail-container.component.scss']
})
export class StudentDetailContainerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private menuState: MenuStateService,
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    @Inject(STUDENT_INSTANCE_CACHE) public studentInstanceCache: SingleItemCache<Student>,
  ) { }

  ngOnInit(): void {
    this.menuState.reset()
  }

}
