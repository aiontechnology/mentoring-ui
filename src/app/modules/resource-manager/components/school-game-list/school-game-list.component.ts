/*
 * Copyright 2021-2022 Aion Technology LLC
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
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {Book} from '../../../../models/book/book';
import {Game} from '../../../../models/game/game';
import {UPDATE_GAME_MENU_TITLE, UPDATE_GAME_SNACKBAR_MESSAGE} from '../../other/resource-constants';
import {GAME_UPDATE_DIALOG_MANAGER, SCHOOL_GAME_TABLE_CACHE} from '../../providers/school-game-providers-factory';
import {SCHOOL_GAME_GROUP} from '../../resource-manager.module';
import {SchoolGameDialogComponent} from '../school-game-dialog/school-game-dialog.component';

@Component({
  selector: 'ms-school-game-list',
  templateUrl: './school-game-list.component.html',
  styleUrls: ['./school-game-list.component.scss']
})
export class SchoolGameListComponent extends ListComponent<Game> implements OnInit, OnDestroy {
  columns = ['name', 'grade1', 'grade2', 'location']

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    @Inject(SCHOOL_GAME_TABLE_CACHE) tableCache: TableCache<Game>,
    //other
    @Inject(GAME_UPDATE_DIALOG_MANAGER) private gameUpdateDialogManager: DialogManager<SchoolGameDialogComponent>,
  ) {
    super(menuState, navService, tableCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<Book>.builder(UPDATE_GAME_MENU_TITLE, SCHOOL_GAME_GROUP, this.gameUpdateDialogManager)
        .withSnackbarMessage(UPDATE_GAME_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          localItems: () => this.tableCache.tableDataSource.data
        }))
        .build()
    ]
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService) =>
    navService.push({routeSpec: ['/resourcemanager'], fragment: 'schoolgame'})
}
