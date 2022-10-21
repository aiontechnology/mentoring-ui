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
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from 'src/app/implementation/route/navigation.service';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {UserSessionService} from 'src/app/implementation/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {AbstractDetailComponent} from '../../../../implementation/component/abstract-detail-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {School} from '../../../../implementation/models/school/school';
import {SCHOOL_ID} from '../../../../implementation/route/route-constants';
import {SchoolRouteWatcher} from '../../../../implementation/route/school-route-watcher';
import {MENTOR_DATA_SOURCE, MENTOR_INSTANCE_CACHE, MENTOR_URI_SUPPLIER} from '../../../../providers/global-mentor-providers-factory';
import {SCHOOL_ROUTE_WATCHER} from '../../../../providers/global-school-providers-factory';
import {MENTOR_DETAIL_MENU} from '../../mentor-manager.module';
import {Mentor} from '../../models/mentor/mentor';

@Component({
  selector: 'ms-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.scss'],
})
export class MentorDetailComponent extends AbstractDetailComponent implements OnInit, OnDestroy {
  constructor(
    // public
    public userSession: UserSessionService,
    // for super
    menuState: MenuStateService,
    @Inject(MENTOR_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    @Inject(SCHOOL_ROUTE_WATCHER) schoolRouteWatcher: SchoolRouteWatcher,
    // other
    @Inject(MENTOR_INSTANCE_CACHE) public mentorCache: SingleItemCache<Mentor>,
    @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
    @Inject(MENTOR_URI_SUPPLIER) private mentorUriSupplier: UriSupplier,
    private navigation: NavigationService,
  ) {
    super(menuState, menuCommands, route, schoolRouteWatcher)
  }

  ngOnInit() {
    super.init();
  }

  ngOnDestroy(): void {
    super.destroy()
    this.navigation.clearRoute();
  }

  protected registerMenus(menuState: MenuStateService, menuCommands: { name: string; factory: (isAdminOnly: boolean) => Command }[]) {
    menuState.clear()
    menuCommands.forEach(command => {
      menuState.add(command.factory(false))
    })
  }

  protected override doSchoolChange = (school: School) => {
    this.routeParams
      .subscribe(params => {
        const mentorId = params.get('mentorId')
        this.mentorUriSupplier.withSubstitution(SCHOOL_ID, school.id)
        this.mentorDataSource.oneValue(mentorId)
          .then(mentor => {
            this.mentorCache.item = mentor
          })
      })
  }
}
