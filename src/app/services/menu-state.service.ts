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
import {UserSessionService} from './user-session.service';

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

  constructor(private userSessionService: UserSessionService) {}

  get activeMenus(): Array<Command> {
    const activeMenus = new Array<Command>();
    for (let group of this.groups.values()) {
      if (group.isVisible) {
        const validMenus = group.menus.filter(menu => this.userSessionService.isSysAdmin || !menu.isAdminOnly)
        activeMenus.push(...validMenus);
      }
    }
    return activeMenus;
  }

  add(command: Command | Command[]): MenuStateService {
    if (Array.isArray(command)) {
      command.forEach(c => this.group(c.group).menus.push(c));
    } else {
      this.group(command.group).menus.push(command);
    }
    return this;
  }

  clear(): MenuStateService {
    this.groups = new Map<string, Group>();
    return this;
  }

  makeAllVisible(): MenuStateService {
    for (const group of this.groups.values()) {
      group.isVisible = true;
    }
    return this;
  }

  makeGroupInvisible(name: string): MenuStateService {
    this.group(name).isVisible = false;
    return this;
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
