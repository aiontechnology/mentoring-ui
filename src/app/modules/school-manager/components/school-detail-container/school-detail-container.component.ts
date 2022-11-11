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

import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {School} from '../../../../implementation/models/school/school';
import {RouteElementWatcher} from '../../../../implementation/route/route-element-watcher.service';
import {MenuStateService} from '../../../../implementation/services/menu-state.service';
import {UserSessionService} from '../../../../implementation/services/user-session.service';
import {SCHOOL_ROUTE_WATCHER} from '../../../../providers/global/global-school-providers-factory';
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
export class SchoolDetailContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscriptions: Subscription[] = []

  constructor(
    public userSession: UserSessionService,
    private menuState: MenuStateService,
    @Inject(SCHOOL_ROUTE_WATCHER) private schoolRouteWatcher: RouteElementWatcher<School>,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.schoolRouteWatcher.watch(this.route, 'SchoolDetailContainerComponent'))
    this.menuState.reset()
    this.menuState.groupNames = [PERSONNEL_GROUP, PROGRAM_ADMIN_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP, SCHOOL_GROUP, TEACHER_GROUP]
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  ngAfterViewInit(): void {
    this.onTabChange(0);
  }

  onTabChange(index: number) {
    setState(index, this.menuState, this.userSession);
  }
}
