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

import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameCacheService } from '../../services/resources/game-cache.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { GameDialogComponent } from '../game-dialog/game-dialog.component';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Game } from 'src/app/modules/shared/models/game/game';

@Component({
  selector: 'ms-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  providers: [GameCacheService]
})
export class GameListComponent implements OnInit {

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.gameCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.gameCacheService.paginator = paginator;
    }
  }

  constructor(public gameCacheService: GameCacheService,
              public userSession: UserSessionService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {

    console.log('Constructing GameListComponent', gameCacheService);

  }

  ngOnInit(): void {
    console.log('Establishing datasource');
    this.gameCacheService.establishDatasource();

    console.log('Adding game list menus');
    if (this.userSession.isSysAdmin) {
      GameListMenuManager.addMenus(this.menuState,
                                   this.router,
                                   this.dialog,
                                   this.snackBar,
                                   (g: Game) => this.jumpToNewItem(g),
                                   this.gameCacheService);
    }
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

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: Game): void {
    this.gameCacheService.clearSelection();
    this.gameCacheService.jumpToItem(newItem);
  }

}

class GameListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (g: Game) => void,
                  gameCacheService: GameCacheService): void {

    console.log('Constructing MenuHandler');

    menuState.add(new NewDialogCommand(
      'Add Game',
      'game',
      GameDialogComponent,
      'Added game',
      null,
      null,
      router,
      dialog,
      snackBar,
      (g: Game) => postAction(g),
      () => true));
    menuState.add(new EditDialogCommand(
      'Edit Game',
      'game',
      GameDialogComponent,
      'Game updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({ model: gameCacheService.getFirstSelection() }),
      (g: Game) => postAction(g),
      () => gameCacheService.selection.selected.length === 1));
    menuState.add(new DeleteDialogCommand(
      'Remove Game(s)',
      'game',
      ConfimationDialogComponent,
      'Game(s) removed',
      'game',
      'games',
      router,
      dialog,
      snackBar,
      null,
      () => gameCacheService.selectionCount,
      () => gameCacheService.removeSelected(),
      () => gameCacheService.selection.selected.length > 0));

  }

}
