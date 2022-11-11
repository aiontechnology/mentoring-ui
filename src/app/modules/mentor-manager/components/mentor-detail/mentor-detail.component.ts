/*
 * Copyright 2021-2022 Aion Technology LLC
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
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {CommandArray} from '../../../../implementation/component/menu-registering-component';
import {SchoolWatchingDetailComponent} from '../../../../implementation/component/school-watching-detail-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {School} from '../../../../implementation/models/school/school';
import {SchoolSession} from '../../../../implementation/models/school/schoolsession';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {RouteElementWatcher} from '../../../../implementation/route/route-element-watcher.service';
import {MENTOR_DATA_SOURCE, MENTOR_INSTANCE_CACHE, MENTOR_ROUTE_WATCHER} from '../../../../providers/global/global-mentor-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../providers/global/global-school-session-providers-factory';
import {MENTOR_DETAIL_MENU} from '../../mentor-manager.module';
import {Mentor} from '../../../../implementation/models/mentor/mentor';

@Component({
  selector: 'ms-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.scss'],
})
export class MentorDetailComponent extends SchoolWatchingDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(MENTOR_DETAIL_MENU) menuCommands: CommandArray,
    route: ActivatedRoute,
    navService: NavigationService,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    // other
    @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
    @Inject(MENTOR_INSTANCE_CACHE) public mentorInstanceCache: SingleItemCache<Mentor>,
    @Inject(MENTOR_ROUTE_WATCHER) private mentorRouteWatcher: RouteElementWatcher<Mentor>,
    private router: Router,
  ) {
    super(menuState, menuCommands, route, schoolInstanceCache, schoolSessionInstanceCache, navService)
  }

  ngOnInit() {
    this.menuState.reset()
    this.init()
    this.subscriptions.push(this.mentorRouteWatcher.watch(this.route))
  }

  ngOnDestroy(): void {
    this.destroy()
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  protected doHandleBackButton = (navService: NavigationService): void =>
    navService.push({routeSpec: ['/mentormanager', 'schools', this.schoolInstanceCache.item.id], fragment: undefined})

  protected onSchoolChange(school: School) {
    this.router.navigate(['mentormanager', 'schools', school.id])
  }
}
