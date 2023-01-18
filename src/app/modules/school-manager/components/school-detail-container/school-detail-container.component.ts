/*
 * Copyright 2022-2023 Aion Technology LLC
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
import {RouteElementWatcher} from '../../../../implementation/route/route-element-watcher.service';
import {UserLoginService} from '../../../../implementation/security/user-login.service';
import {MenuStateService} from '../../../../implementation/services/menu-state.service';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {School} from '../../../../models/school/school';
import {SCHOOL_INSTANCE_CACHE, SCHOOL_ROUTE_WATCHER} from '../../../../providers/global/global-school-providers-factory';
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
  tabIndex: number = 0
  private subscriptions: Subscription[] = []

  constructor(
    public userLoginService: UserLoginService,
    private menuState: MenuStateService,
    @Inject(SCHOOL_ROUTE_WATCHER) private schoolRouteWatcher: RouteElementWatcher<School>,
    private route: ActivatedRoute,
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstance: SingleItemCache<School>,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(this.schoolRouteWatcher.watch(this.route, 'SchoolDetailContainerComponent'))
    this.menuState.reset()
    this.menuState.groupNames = [PERSONNEL_GROUP, PROGRAM_ADMIN_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP, SCHOOL_GROUP, TEACHER_GROUP]
    this.route.fragment.subscribe(fragment => {
      switch (fragment) {
        case 'book':
          this.tabIndex = 4
          break
        case 'game':
          this.tabIndex = 5
          break
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  ngAfterViewInit(): void {
    this.onTabChange(this.tabIndex)
  }

  onTabChange(index: number) {
    setState(index, this.menuState, this.userLoginService);
  }
}
