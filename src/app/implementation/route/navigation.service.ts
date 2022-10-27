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

type RouteSpec = string[]
type FullSpec = { routeSpec: RouteSpec, fragment: string }

@Injectable()
export class NavigationService {
  private routeSpecStack: FullSpec[] = []

  get isEmpty() {
    return this.routeSpecStack.length === 0
  }

  clear(): void {
    this.routeSpecStack = []
  }

  push(spec: FullSpec): void {
    this.routeSpecStack.push(spec)
  }

  pop(): FullSpec {
    return this.routeSpecStack.pop()
  }

  peek(): FullSpec | null {
    return this.isEmpty
      ? null
      : this.routeSpecStack[this.routeSpecStack.length - 1]
  }
}
