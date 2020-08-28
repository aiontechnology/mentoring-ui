/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Command } from '../implementation/command/command';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {

  activeMenus: Array<Command> = new Array();
  title: string;

  constructor() { }

  add(command: Command): void {
    this.activeMenus.push(command);
  }

  clear(): void {
    this.activeMenus = new Array();
  }

  makeAllVisible(): void {
    for (const menu of this.activeMenus) {
      menu.isVisible = true;
    }
  }

  makeGroupInvisible(group: string): void {
    for (const menu of this.activeMenus) {
      if (menu.group === group) {
        menu.isVisible = false;
      }
    }
  }

}
