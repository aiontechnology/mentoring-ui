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

import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {School} from '../../../../implementation/models/school/school';
import {RouteElementWatcher} from '../../../../implementation/route/route-element-watcher.service';
import {MenuStateService} from '../../../../implementation/services/menu-state.service';
import {UserSessionService} from '../../../../implementation/services/user-session.service';
import {SCHOOL_ROUTE_WATCHER} from '../../../../providers/global-school-providers-factory';
import {BOOK_GROUP, GAME_GROUP} from '../../../resource-manager/resource-manager.module';
import {
  PERSONNEL_GROUP,
  PROGRAM_ADMIN_GROUP,
  SCHOOL_BOOK_GROUP,
  SCHOOL_GAME_GROUP,
  SCHOOL_GROUP,
  TEACHER_GROUP
} from '../../school-manager.module';
import {setState} from './menu-state-manager';

@Component({
  selector: 'ms-school-detail-container',
  templateUrl: './school-detail-container.component.html',
  styleUrls: ['./school-detail-container.component.scss']
})
export class SchoolDetailContainerComponent implements OnInit, AfterViewInit {
  constructor(
    public userSession: UserSessionService,
    private menuState: MenuStateService,
    @Inject(SCHOOL_ROUTE_WATCHER) private schoolRouteWatcher: RouteElementWatcher<School>,
    route: ActivatedRoute,
  ) {
    this.schoolRouteWatcher.watch(route)
  }

  ngOnInit(): void {
    this.menuState.clear()
    this.menuState.groupNames = [PERSONNEL_GROUP, PROGRAM_ADMIN_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP, SCHOOL_GROUP, TEACHER_GROUP]
  }

  ngAfterViewInit(): void {
    this.onTabChange(0);
  }

  onTabChange(index: number) {
    setState(index, this.menuState, this.userSession);
  }
}
