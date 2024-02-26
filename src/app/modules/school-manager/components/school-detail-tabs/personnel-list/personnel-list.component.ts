/*
 * Copyright 2020-2024 Aion Technology LLC
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
import {Personnel} from '@models/personnel/personnel';
import {PersonnelDialogComponent} from '@modules-school-manager/components/school-detail-tabs/personnel-dialog/personnel-dialog.component';
import {
  ADD_PERSONNEL_MENU_TITLE,
  ADD_PERSONNEL_PANEL_TITLE,
  ADD_PERSONNEL_SNACKBAR_MESSAGE,
  EDIT_PERSONNEL_MENU_TITLE,
  EDIT_PERSONNEL_PANEL_TITLE,
  EDIT_PERSONNEL_SNACKBAR_MESSAGE,
  PLURAL_PERSONNEL,
  REMOVE_PERSONNEL_MENU_TITLE,
  REMOVE_PERSONNEL_SNACKBAR_MESSAGE,
  SINGULAR_PERSONNEL
} from '@modules-school-manager/other/school-constants';
import {
  PERSONNEL_DELETE_DIALOG_MANAGER,
  PERSONNEL_EDIT_DIALOG_MANAGER,
  PERSONNEL_TABLE_CACHE
} from '@modules-school-manager/providers/personnel-providers-factory';
import {PERSONNEL_GROUP} from '@modules-school-manager/school-manager.module';
import {ConfirmationDialogComponent} from '@modules-shared/components/confirmation-dialog/confirmation-dialog.component';
import {PERSONNEL_INSTANCE_CACHE} from '@providers/global/global-personnel-providers-factory';

@Component({
  selector: 'ms-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent extends ListComponent<Personnel> implements OnInit, OnDestroy {
  columns = ['select', 'type', 'lastName', 'firstName', 'email', 'cellPhone']

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    route: ActivatedRoute,
    @Inject(PERSONNEL_TABLE_CACHE) tableCache: TableCache<Personnel>,
    @Inject(PERSONNEL_INSTANCE_CACHE) personnelInstanceCache: SingleItemCache<Personnel>,
    // other
    @Inject(PERSONNEL_EDIT_DIALOG_MANAGER) private personnelEditDialogManager: DialogManager<PersonnelDialogComponent>,
    @Inject(PERSONNEL_DELETE_DIALOG_MANAGER) private personnelDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
  ) {
    super(menuState, navService, route, tableCache, personnelInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(ADD_PERSONNEL_MENU_TITLE, PERSONNEL_GROUP, this.personnelEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_PERSONNEL_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_PERSONNEL_SNACKBAR_MESSAGE)
        .build(),
      MenuDialogCommand
        .builder(EDIT_PERSONNEL_MENU_TITLE, PERSONNEL_GROUP, this.personnelEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_PERSONNEL_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_PERSONNEL_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand
        .builder(REMOVE_PERSONNEL_MENU_TITLE, PERSONNEL_GROUP, this.personnelDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR_PERSONNEL,
          pluralName: PLURAL_PERSONNEL,
          nameSupplier: () => this.tableCache.selection.selected.map(selection => selection.fullName),
        }))
        .withSnackbarMessage(REMOVE_PERSONNEL_SNACKBAR_MESSAGE)
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

  protected override loadTableCache = async (): Promise<void> => {
    // do nothing
  }
}
