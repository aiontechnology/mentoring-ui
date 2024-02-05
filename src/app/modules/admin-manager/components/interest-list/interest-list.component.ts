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
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {Interest} from '../../../../models/interest';
import {INTEREST_INSTANCE_CACHE} from '../../../../providers/global/global-interest-providers-factory';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {INTERESTS_GROUP} from '../../admin-manager.module';
import {
  ADD_INTEREST_MENU_TITLE,
  ADD_INTEREST_PANEL_TITLE,
  ADD_INTEREST_SNACKBAR_MESSAGE,
  EDIT_INTEREST_MENU_TITLE,
  EDIT_INTEREST_PANEL_TITLE,
  EDIT_INTEREST_SNACKBAR_MESSAGE
} from '../../other/admin-constants';
import {
  INTEREST_LIST_DELETE_DIALOG_MANAGER,
  INTEREST_LIST_EDIT_DIALOG_MANAGER,
  INTEREST_TABLE_CACHE
} from '../../providers/interest-providers-factory';
import {InterestDialogComponent} from '../interest-dialog/interest-dialog.component';

@Component({
  selector: 'ms-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.scss']
})
export class InterestListComponent extends ListComponent<Interest> implements OnInit, OnDestroy {
  columns = ['select', 'name']

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    @Inject(INTEREST_TABLE_CACHE) tableCache: TableCache<Interest>,
    @Inject(INTEREST_INSTANCE_CACHE) interestInstanceCache: SingleItemCache<Interest>,
    // other
    @Inject(INTEREST_LIST_EDIT_DIALOG_MANAGER) private interestEditDialogManager: DialogManager<InterestDialogComponent>,
    @Inject(INTEREST_LIST_DELETE_DIALOG_MANAGER) private interestDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
  ) {
    super(menuState, navService, tableCache, interestInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort}

  protected override get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(ADD_INTEREST_MENU_TITLE, INTERESTS_GROUP, this.interestEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_INTEREST_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_INTEREST_SNACKBAR_MESSAGE)
        .build(),
      MenuDialogCommand
        .builder(EDIT_INTEREST_MENU_TITLE, INTERESTS_GROUP, this.interestEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_INTEREST_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_INTEREST_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
    ]
  }

  ngOnInit(): void {
    this.menuState.reset()
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

}
