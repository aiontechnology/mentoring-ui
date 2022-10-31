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

import {Command} from '../command/command';
import {MenuStateService} from '../services/menu-state.service';

export type CommandArray = { name: string, factory: (isAdminOnly: boolean) => Command }[]

export abstract class MenuRegisteringComponent {
  protected constructor(
    protected menuState: MenuStateService,
    private menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
  ) {
  }

  /**
   * Run the component set up.
   */
  protected init(): void {
    this.registerMenus(this.menuState, this.menuCommands)
  }

  /**
   * Run the component teardown.
   */
  protected destroy(): void {
    // do nothing
  }

  /**
   * Register the set of menus for the component.
   * @param menuState The component that maintains the menu state.
   * @param menuCommands The array of menu commands.
   * @protected
   */
  protected registerMenus(menuState: MenuStateService, menuCommands: CommandArray) {
    menuCommands.forEach(command => {
      menuState.add(command.factory(false))
    })
  }

}
