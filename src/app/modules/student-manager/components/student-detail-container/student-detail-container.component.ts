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
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {SchoolSession} from '../../../../implementation/models/school/schoolsession';
import {MenuStateService} from '../../../../implementation/services/menu-state.service';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../providers/global-school-session-providers-factory';

@Component({
  selector: 'ms-student-detail-container',
  templateUrl: './student-detail-container.component.html',
  styleUrls: ['./student-detail-container.component.scss']
})
export class StudentDetailContainerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private menuState: MenuStateService,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
  ) { }

  ngOnInit(): void {
    this.menuState.reset()
  }

}
