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
import {URI} from '../data/uri-supplier';
import {NavigationService} from '../route/navigation.service';
import {MenuStateService} from '../services/menu-state.service';
import {CommandArray, MenuRegisteringComponent} from './menu-registering-component';

export abstract class DetailComponent extends MenuRegisteringComponent {
  protected constructor(
    menuState: MenuStateService,
    menuCommands: CommandArray,
    protected route: ActivatedRoute,
    private navService?: NavigationService,
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

  protected override init(): void {
    super.init()
    this.handleRoute(this.route)
    this.handleBackButton(this.navService)
  }

  protected override destroy(): void {
    super.destroy()
    this.navService?.clear();
  }

  /**
   * Allow the subclass to do something specific with the given route
   * @param route The activate route
   * @protected
   */
  protected handleRoute(route: ActivatedRoute): void {
    // do nothing
  }

  protected doHandleBackButton(navService: NavigationService): void {
    // do nothing
  }

  protected onUriChange = (uri: URI): void => {
    // do nothing
  }

  private handleBackButton(navService: NavigationService): void {
    if (navService) {
      this.doHandleBackButton(navService)
    }
  }
}
