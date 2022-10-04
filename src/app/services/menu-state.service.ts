/*
 * Copyright 2020-2022 Aion Technology LLC
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
import {Command} from '../implementation/command/command';

class Group {
  menus = new Array<Command>();
  constructor(public isVisible: boolean) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  groups = new Map<string, Group>();
  title: string;

  get activeMenus(): Array<Command> {
    const activeMenus = new Array<Command>();
    for (let group of this.groups.values()) {
      if (group.isVisible) {
        activeMenus.push(...group.menus);
      }
    }
    return activeMenus;
  }

  add(command: Command): void {
    this.group(command.group).menus.push(command);
  }

  clear(): void {
    this.groups = new Map<string, Group>();
  }

  makeAllVisible(): void {
    for (const group of this.groups.values()) {
      group.isVisible = true;
    }
  }

  makeGroupInvisible(name: string): void {
    this.group(name).isVisible = false;
  }

  private group(name: string): Group {
    let group = this.groups.get(name);
    if (!group) {
      group = new Group(true);
      this.groups.set(name, group);
    }
    return group;
  }
}
