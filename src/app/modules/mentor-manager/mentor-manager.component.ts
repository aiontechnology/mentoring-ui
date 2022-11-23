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
import {SingleItemCacheSchoolChangeHandler} from '../../implementation/state-management/single-item-cache-school-change-handler';
import {Mentor} from '../../models/mentor/mentor';
import {MENTOR_SCHOOL_CHANGE_HANDLER} from './providers/mentor-providers-factory';

@Component({
  selector: 'ms-mentor-manager',
  templateUrl: './mentor-manager.component.html',
  styleUrls: ['./mentor-manager.component.scss']
})
export class MentorManagerComponent implements OnInit, OnDestroy {
  constructor(
    private menuState: MenuStateService,
    @Inject(MENTOR_SCHOOL_CHANGE_HANDLER) private mentorSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<Mentor>,
  ) {}

  ngOnInit(): void {
    this.menuState.title = 'Mentor Manager';
    this.mentorSchoolChangeHandler.start()
  }

  ngOnDestroy(): void {
    this.mentorSchoolChangeHandler.stop()
  }
}
