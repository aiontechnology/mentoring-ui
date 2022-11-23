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

import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {School} from '../../models/school/school';
import {SchoolSession} from '../../models/school/schoolsession';
import {NavigationService} from '../route/navigation.service';
import {MenuStateService} from '../services/menu-state.service';
import {SingleItemCache} from '../state-management/single-item-cache';
import {DetailComponent} from './detail-component';

export abstract class SchoolWatchingDetailComponent extends DetailComponent {
  private schoolWatchingDetailComponentSubscriptions: Subscription[] = []

  protected constructor(
    menuState: MenuStateService,
    route: ActivatedRoute,
    // other
    protected schoolInstanceCache: SingleItemCache<School>,
    public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    // optional
    navService?: NavigationService,
  ) {
    super(menuState, route, navService);
  }

  protected init() {
    super.init();
    this.schoolWatchingDetailComponentSubscriptions.push(this.schoolInstanceCache.newOnly.subscribe(this.onSchoolChange.bind(this)))
    this.schoolWatchingDetailComponentSubscriptions.push(this.schoolSessionInstanceCache.newOnly.subscribe(this.onSchoolSessionChange.bind(this)))
  }

  protected destroy() {
    super.destroy();
    this.schoolWatchingDetailComponentSubscriptions.forEach(subscription => subscription.unsubscribe())
    this.schoolWatchingDetailComponentSubscriptions = []
  }

  protected abstract onSchoolChange(school: School)

  protected onSchoolSessionChange(schoolSession: SchoolSession) {
    // do nothing
  }
}
