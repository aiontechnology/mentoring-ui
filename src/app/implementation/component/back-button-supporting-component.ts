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

import {NavigationService} from '../route/navigation.service';

export abstract class BackButtonSupportingComponent {
  protected constructor(
    private navService: NavigationService,
  ) {}

  protected init() {
    // Do nothing
  }

  protected destroy() {
    // Do nothing
  }

  routeWithBackButton(path: string[]) {
    this.handleBackButton(this.navService)
    this.navService.routeTo(path)
  }

  protected doHandleBackButton(navService: NavigationService): void {
    // Do nothing
  }

  private handleBackButton(navService: NavigationService): void {
    if (navService) {
      this.doHandleBackButton(navService)
    }
  }
}
