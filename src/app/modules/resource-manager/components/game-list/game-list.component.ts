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

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Game} from 'src/app/modules/shared/models/game/game';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {UserSessionService} from 'src/app/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {GAME_LIST_MENU, GAME_TABLE_CACHE} from '../../providers/game-providers-factory';

@Component({
  selector: 'ms-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  constructor(@Inject(GAME_TABLE_CACHE) public tableCache: TableCache<Game>,
              public userSession: UserSessionService,
              private breakpointObserver: BreakpointObserver,
              private menuState: MenuStateService,
              @Inject(GAME_LIST_MENU) private menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[]) {
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.tableCache.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.tableCache.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.menuCommands.forEach(command => {
      this.menuState.add(command.factory(true))
    })

    this.tableCache.loadData()
      .then(() => this.tableCache.clearSelection());
  }

  displayedColumns(): string[] {
    const displayedColumns = [];
    if (this.userSession.isSysAdmin) {
      displayedColumns.push('select');
    }
    displayedColumns.push('name');
    if (!this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      displayedColumns.push('grade1', 'grade2', 'location');
    }
    return displayedColumns;
  }
}
