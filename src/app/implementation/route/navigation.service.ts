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

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

type RouteSpec = string[]
export type FullSpec = { routeSpec: RouteSpec, fragment: string }

@Injectable()
export class NavigationService {
  constructor(
    private router: Router,
  ) {}

  private routeSpecStack: FullSpec[] = []

  pop(): FullSpec {
    return this.routeSpecStack.pop()
  }

  push(spec: FullSpec) {
    this.routeSpecStack.push(spec)
  }

  get isEmpty() {
    return this.routeSpecStack.length === 0
  }

  clear(): void {
    this.routeSpecStack = []
  }

  routeTo = (path: string[]) => {
    this.router.navigate(path)
  }
}
