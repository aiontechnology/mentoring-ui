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

import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'ms-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              public gameCacheService: GameCacheService) {
    console.log('Constructing GameListComponent', gameCacheService);
  }

  ngOnInit(): void {
    console.log('Establishing datasource');
    this.gameCacheService.establishDatasource();
    this.gameCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding game list menus')
    GameListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.gameCacheService);
  }

  ngAfterViewInit(): void {
    this.gameCacheService.sort = this.sort;
    this.gameCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name', 'description'];
    } else {
      return ['select', 'name', 'description', 'gradeLevel'];
    }
  }

}

class GameListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  gameCacheService: GameCacheService) {
    console.log('Constructing MenuHandler');
    menuState.add(new NewDialogCommand(
      'Create New Game',
      'game',
      GameDialogComponent,
      'Added game',
      null,
      null,
      router,
      dialog,
      snackBar));
    menuState.add(new EditDialogCommand(
      'Edit Game',
      'game',
      GameDialogComponent,
      'Game updated',
      null,
      router,
      dialog,
      snackBar,
      () => gameCacheService.getFirstSelection(),
      () => gameCacheService.clearSelection(),
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
      () => { },
      () => gameCacheService.selection.selected.length > 0));
  }

}
