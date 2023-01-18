/*
 * Copyright 2021-2023 Aion Technology LLC
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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {resourceGrades} from 'src/app/implementation/constants/resourceGrades';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Game} from 'src/app/models/game/game';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {DetailComponent} from '../../../../implementation/component/detail-component';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {GAME_ID} from '../../../../implementation/route/route-constants';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from '../../../../implementation/state-management/single-item-cache-updater';
import {GAME_INSTANCE_CACHE, GAME_INSTANCE_CACHE_UPDATER} from '../../../../providers/global/global-game-providers-factory';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  EDIT_GAME_MENU_TITLE,
  EDIT_GAME_PANEL_TITLE,
  EDIT_GAME_SNACKBAR_MESSAGE,
  PLURAL_GAME,
  REMOVE_GAME_MENU_TITLE,
  REMOVE_GAME_SNACKBAR_MESSAGE,
  SINGULAR_GAME
} from '../../other/resource-constants';
import {GAME_DETAIL_DELETE_DIALOG_MANAGER, GAME_DETAIL_EDIT_DIALOG_MANAGER} from '../../providers/game-providers-factory';
import {GAME_GROUP} from '../../resource-manager.module';
import {GameDialogComponent} from '../game-dialog/game-dialog.component';

@Component({
  selector: 'ms-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent extends DetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    route: ActivatedRoute,
    navService: NavigationService,
    // other
    @Inject(GAME_DETAIL_EDIT_DIALOG_MANAGER) private gameEditDialogManager: DialogManager<GameDialogComponent>,
    @Inject(GAME_DETAIL_DELETE_DIALOG_MANAGER) private gameDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
    @Inject(GAME_INSTANCE_CACHE) public gameInstanceCache: SingleItemCache<Game>,
    @Inject(GAME_INSTANCE_CACHE_UPDATER) private gameInstanceCacheUpdater: SingleItemCacheUpdater<Game>,
  ) {
    super(menuState, route, navService)
    menuState.reset()
  }

  get gradeRangeDisplay(): string {
    let grades = resourceGrades[this.gameInstanceCache.item?.grade1 - 1]?.valueView;
    if (resourceGrades[this.gameInstanceCache.item?.grade2 - 1]?.valueView) {
      grades += ` - ${resourceGrades[this.gameInstanceCache.item?.grade2 - 1]?.valueView}`;
    }
    return grades;
  }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<GameDialogComponent>.builder(EDIT_GAME_MENU_TITLE, GAME_GROUP, this.gameEditDialogManager)
        .withSnackbarMessage(EDIT_GAME_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.gameInstanceCache.item,
          panelTitle: EDIT_GAME_PANEL_TITLE
        }))
        .build(),
      MenuDialogCommand<ConfirmationDialogComponent>.builder(REMOVE_GAME_MENU_TITLE, GAME_GROUP, this.gameDeleteDialogManager)
        .withSnackbarMessage(REMOVE_GAME_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.gameInstanceCache.item,
          singularName: SINGULAR_GAME,
          pluralName: PLURAL_GAME,
          nameSupplier: () => [this.gameInstanceCache.item.name],
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

  protected override handleRoute = async (route: ActivatedRoute): Promise<void> => {
    await route.paramMap
      .subscribe(params => {
        this.gameInstanceCacheUpdater.fromId(params.get(GAME_ID));
      })
  }
}
