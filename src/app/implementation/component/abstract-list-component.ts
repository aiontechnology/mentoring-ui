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

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Command} from '../command/command';
import {MenuStateService} from '../services/menu-state.service';
import {TableCache} from '../table-cache/table-cache';
import {AbstractComponent} from './abstract-component';

export abstract class AbstractListComponent<T> extends AbstractComponent {
  protected constructor(
    // for super
    menuState: MenuStateService,
    menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    // other
    public tableCache: TableCache<T>,
  ) {
    super(menuState, menuCommands)
  }

  protected doInit() {
    this.tableCache.loadData()
      .then(() => this.tableCache.clearSelection())
  }

  protected set sort(sort: MatSort) {
    this.tableCache.sort = sort
  }

  protected set paginator(paginator: MatPaginator) {
    this.tableCache.paginator = paginator
  }
}
