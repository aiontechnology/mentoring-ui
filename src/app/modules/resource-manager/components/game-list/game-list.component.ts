/*
 * Copyright 2020-2023 Aion Technology LLC
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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Game} from 'src/app/models/game/game';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {UserLoginService} from '../../../../implementation/security/user-login.service';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {GAME_INSTANCE_CACHE} from '../../../../providers/global/global-game-providers-factory';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  ADD_GAME_MENU_TITLE,
  ADD_GAME_PANEL_TITLE,
  ADD_GAME_SNACKBAR_MESSAGE,
  EDIT_GAME_MENU_TITLE,
  EDIT_GAME_PANEL_TITLE,
  EDIT_GAME_SNACKBAR_MESSAGE,
  PLURAL_GAME,
  REMOVE_GAME_MENU_TITLE,
  REMOVE_GAME_SNACKBAR_MESSAGE,
  SINGULAR_GAME
} from '../../other/resource-constants';
import {GAME_LIST_DELETE_DIALOG_MANAGER, GAME_LIST_EDIT_DIALOG_MANAGER, GAME_TABLE_CACHE} from '../../providers/game-providers-factory';
import {GAME_GROUP} from '../../resource-manager.module';
import {GameDialogComponent} from '../game-dialog/game-dialog.component';

@Component({
  selector: 'ms-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent extends ListComponent<Game> implements OnInit, OnDestroy {
  public columns = ['name', 'grade1', 'grade2', 'location']

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    @Inject(GAME_TABLE_CACHE) tableCache: TableCache<Game>,
    @Inject(GAME_INSTANCE_CACHE) gameInstanceCache: SingleItemCache<Game>,
    // other
    @Inject(GAME_LIST_EDIT_DIALOG_MANAGER) private gameEditDialogManager: DialogManager<GameDialogComponent>,
    @Inject(GAME_LIST_DELETE_DIALOG_MANAGER) private gameDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
    public userLoginService: UserLoginService,
  ) {
    super(menuState, navService, tableCache, gameInstanceCache)
    if (userLoginService.isSystemAdmin) {
      this.columns = ['select'].concat(this.columns)
    }
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<GameDialogComponent>.builder(ADD_GAME_MENU_TITLE, GAME_GROUP, this.gameEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_GAME_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_GAME_SNACKBAR_MESSAGE)
        .withAdminOnly(true)
        .build(),
      MenuDialogCommand<GameDialogComponent>.builder(EDIT_GAME_MENU_TITLE, GAME_GROUP, this.gameEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_GAME_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_GAME_SNACKBAR_MESSAGE)
        .withAdminOnly(true)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand<ConfirmationDialogComponent>.builder(REMOVE_GAME_MENU_TITLE, GAME_GROUP, this.gameDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR_GAME,
          pluralName: PLURAL_GAME,
          nameSupplier: () => this.tableCache.selection.selected.map(selection => selection.name)
        }))
        .withSnackbarMessage(REMOVE_GAME_SNACKBAR_MESSAGE)
        .withAdminOnly(true)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length > 0)
    ]
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService) =>
    navService.push({routeSpec: ['/resourcemanager'], fragment: 'game'})
}
