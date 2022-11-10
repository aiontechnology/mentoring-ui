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
import {EnableableCommand} from '../command/enableable-command';
import {MenuCommand} from '../command/menu-command';
import {Resettable} from '../state-management/resettable';
import {UserSessionService} from './user-session.service';

class Group {
  menus = new Array<MenuCommand>();

  constructor(public isVisible: boolean) {
  }
}

@Injectable()
export class MenuStateService implements Resettable {
  groups = new Map<string, Group>();
  title: string;

  constructor(private userSessionService: UserSessionService) {}

  get activeMenus(): Array<EnableableCommand> {
    const activeMenus = new Array<EnableableCommand>();
    for (let group of this.groups.values()) {
      if (group.isVisible) {
        const validMenus = group.menus.filter(menu => this.userSessionService.isSysAdmin || !menu.isAdminOnly)
        activeMenus.push(...validMenus);
      }
    }
    return activeMenus;
  }

  set groupNames(groupNames: string[]) {
    groupNames.forEach(groupName => {
      this.groups.set(groupName, new Group(false))
    })
  }

  add(command: MenuCommand | MenuCommand[]): MenuStateService {
    if (Array.isArray(command)) {
      command.forEach(c => this.group(c.group).menus.push(c));
    } else {
      this.group(command.group).menus.push(command);
    }
    return this;
  }

  reset(): MenuStateService {
    this.groups = new Map<string, Group>();
    return this;
  }

  makeAllInvisible(): MenuStateService {
    for (const group of this.groups.values()) {
      group.isVisible = false;
    }
    return this;
  }

  makeGroupVisible(name: string): MenuStateService {
    this.group(name).isVisible = true;
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
