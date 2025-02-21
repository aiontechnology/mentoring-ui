/*
 * Copyright 2021-2024 Aion Technology LLC
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
import {ActivatedRoute} from '@angular/router';
import {DialogManager} from '@implementation/command/dialog-manager';
import {MenuDialogCommand} from '@implementation/command/menu-dialog-command';
import {ListComponent} from '@implementation/component/list-component';
import {NavigationService} from '@implementation/route/navigation.service';
import {MenuStateService} from '@implementation/services/menu-state.service';
import {SingleItemCache} from '@implementation/state-management/single-item-cache';
import {TableCache} from '@implementation/table-cache/table-cache';
import {Game} from '@models/game/game';
import {School} from '@models/school/school';
import {
  SchoolGameDialogComponent
} from '@modules-school-manager/components/school-detail-tabs/school-game-dialog/school-game-dialog.component';
import {UPDATE_GAME_MENU_TITLE, UPDATE_GAME_SNACKBAR_MESSAGE} from '@modules-school-manager/other/school-constants';
import {GAME_UPDATE_DIALOG_MANAGER, SCHOOL_GAME_TABLE_CACHE} from '@modules-school-manager/providers/school-game-providers-factory';
import {SCHOOL_GAME_GROUP} from '@modules-school-manager/school-manager.module';
import {SCHOOL_INSTANCE_CACHE} from '@providers/global/global-school-providers-factory';

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
    route: ActivatedRoute,
    @Inject(SCHOOL_GAME_TABLE_CACHE) tableCache: TableCache<Game>,
    //other
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolInstanceCache: SingleItemCache<School>,
    @Inject(GAME_UPDATE_DIALOG_MANAGER) private gameUpdateDialogManager: DialogManager<SchoolGameDialogComponent>,
  ) {
    super(menuState, navService, route, tableCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(UPDATE_GAME_MENU_TITLE, SCHOOL_GAME_GROUP, this.gameUpdateDialogManager)
        .withSnackbarMessage(UPDATE_GAME_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          localItems: () => this.tableCache.tableDataSource.data
        }))
        .build()
    ];
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService) =>
    navService.push({
      routeSpec: ['/schoolsmanager/schools', this.schoolInstanceCache.item.id],
      fragment: 'game',
      filter: this.tableCache.filterBinding
    })

  protected override loadTableCache = async (): Promise<void> => {
    // do nothing
  }
}
