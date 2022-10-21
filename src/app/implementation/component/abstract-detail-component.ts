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

import {ActivatedRoute, ParamMap} from '@angular/router';
import {Observable} from 'rxjs';
import {Command} from '../command/command';
import {School} from '../models/school/school';
import {SchoolRouteWatcher} from '../route/school-route-watcher';
import {MenuStateService} from '../services/menu-state.service';
import {AbstractComponent} from './abstract-component';

export abstract class AbstractDetailComponent extends AbstractComponent {
  protected constructor(
    menuState: MenuStateService,
    menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    private route: ActivatedRoute,
    private schoolRouteWatcher?: SchoolRouteWatcher,
  ) {
    super(menuState, menuCommands)
  }

  /**
   * Get the parameter map from the current route.
   * @protected
   */
  protected get routeParams(): Observable<ParamMap> {
    return this.route.paramMap
  }

  protected override doInit(): void {
    this.schoolRouteWatcher?.watch(this.route)
      .subscribe(this.onSchoolChange)
    this.doHandleRoute(this.route)
  }

  /**
   * Allow the subclass to do something specific with the given route
   * @param route The activate route
   * @protected
   */
  protected doHandleRoute(route: ActivatedRoute) {
    // do nothing
  }

  // final
  protected onTabChange(index: number) {
    this.doTabChange(index, this.menuState)
  }

  protected doTabChange(index: number, menuState: MenuStateService) {
    // do nothing
  }

  /**
   * Allow the subclass to respond to a school change event.
   * @param school The new school.
   * @protected
   */
  protected doSchoolChange = (school: School): void => {
    // do nothing
  }

  /**
   * Handle a new school change event.
   * @param school The new school.
   * @private
   */
  private onSchoolChange = (school: School): void => {
    if (school) {
      this.doSchoolChange(school)
    }
  }
}
