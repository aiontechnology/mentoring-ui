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

import {Subscription} from 'rxjs';
import {Command} from '../command/command';
import {SingleItemCache} from '../state-management/single-item-cache';
import {School} from '../models/school/school';
import {SchoolSession} from '../models/school/schoolsession';
import {MenuStateService} from '../services/menu-state.service';
import {TableCache} from '../table-cache/table-cache';
import {ListComponent} from './list-component';

export abstract class SchoolWatchingListComponent<T> extends ListComponent<T> {
  private schoolWatchingListComponentSubscriptions: Subscription[] = []

  protected constructor(
    // for super
    menuState: MenuStateService,
    menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    tableCache: TableCache<T>,
    instanceCache: SingleItemCache<T>,
    // other
    private schoolInstanceCache: SingleItemCache<School>,
    public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
  ) {
    super(menuState, menuCommands, tableCache, instanceCache);
  }

  protected init() {
    super.init();
    this.schoolWatchingListComponentSubscriptions.push(this.schoolInstanceCache.newOnly.subscribe(this.onSchoolChange.bind(this)))
    this.schoolWatchingListComponentSubscriptions.push(this.schoolSessionInstanceCache.newOnly.subscribe(this.onSchoolSessionChange.bind(this)))
  }

  protected destroy() {
    super.destroy();
    this.schoolWatchingListComponentSubscriptions.forEach(subscription => subscription.unsubscribe())
    this.schoolWatchingListComponentSubscriptions = []
  }

  protected abstract onSchoolChange(school: School)

  protected onSchoolSessionChange(schoolSession: SchoolSession) {
    // do nothing
  }
}
