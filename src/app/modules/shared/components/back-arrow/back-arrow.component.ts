/*
 * Copyright 2022-2024 Aion Technology LLC
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

import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FullSpec, NavigationService} from '@implementation/route/navigation.service';

@Component({
  selector: 'ms-back-arrow',
  templateUrl: './back-arrow.component.html',
  styleUrls: ['./back-arrow.component.scss']
})
export class BackArrowComponent {
  constructor(
    private navService: NavigationService,
    private router: Router,
  ) {}

  get hasPreviousRoute(): boolean {
    return !this.navService.isEmpty
  }

  returnToPreviousRoute = (): void => {
    const previousRoute = this.navService.pop()
    if (previousRoute) {
      this.router.navigate(previousRoute.routeSpec, this.createNavParam(previousRoute))
    }
  }

  private createNavParam(previousRoute: FullSpec) {
    if (previousRoute.filter) {
      return {
        queryParams: {filter: previousRoute.filter},
        fragment: previousRoute.fragment
      }
    } else {
      return {
        fragment: previousRoute.fragment
      }
    }
  }
}
