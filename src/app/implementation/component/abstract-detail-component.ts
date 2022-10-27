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
import {SchoolUriSupplier} from '../data/school-uri-supplier';
import {URI} from '../data/uri-supplier';
import {NavigationService} from '../route/navigation.service';
import {MenuStateService} from '../services/menu-state.service';
import {AbstractComponent} from './abstract-component';

export abstract class AbstractDetailComponent extends AbstractComponent {
  protected constructor(
    menuState: MenuStateService,
    menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    private route: ActivatedRoute,
    private uriSuppler?: SchoolUriSupplier,
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

  protected override doInit = async (): Promise<void> => {
    this.uriSuppler?.observable?.subscribe(this.onUriChange)
    await this.doHandleRoute(this.route)
    await this.handleBackButton(this.navService)
  }

  protected async doDestroy(): Promise<void> {
    return this.navService.clear();
  }

  /**
   * Allow the subclass to do something specific with the given route
   * @param route The activate route
   * @protected
   */
  protected doHandleRoute = async (route: ActivatedRoute): Promise<void> =>
    Promise.resolve()

  protected doHandleBackButton = async (navService: NavigationService): Promise<void> =>
    Promise.resolve()

  protected onUriChange = (uri: URI): void => {
    // do nothing
  }

  private handleBackButton = async (navService:NavigationService): Promise<void> => {
    if(navService) {
      await this.doHandleBackButton(navService)
    }
  }
}
