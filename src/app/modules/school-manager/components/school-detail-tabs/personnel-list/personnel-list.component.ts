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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../../implementation/component/list-component';
import {Personnel} from '../../../../../implementation/models/personnel/personnel';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../../implementation/table-cache/table-cache';
import {PERSONNEL_INSTANCE_CACHE} from '../../../../../providers/global/global-personnel-providers-factory';
import {ConfimationDialogComponent} from '../../../../shared/components/confimation-dialog/confimation-dialog.component';
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
} from '../../../other/school-constants';
import {
  PERSONNEL_DELETE_DIALOG_MANAGER,
  PERSONNEL_EDIT_DIALOG_MANAGER,
  PERSONNEL_TABLE_CACHE
} from '../../../providers/personnel-providers-factory';
import {PERSONNEL_GROUP} from '../../../school-manager.module';
import {PersonnelDialogComponent} from '../personnel-dialog/personnel-dialog.component';

@Component({
  selector: 'ms-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent extends ListComponent<Personnel> implements OnInit, OnDestroy {
  columns = ['select', 'type', 'firstName', 'lastName', 'email', 'cellPhone']

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(PERSONNEL_TABLE_CACHE) tableCache: TableCache<Personnel>,
    @Inject(PERSONNEL_INSTANCE_CACHE) personnelInstanceCache: SingleItemCache<Personnel>,
    // other
    @Inject(PERSONNEL_EDIT_DIALOG_MANAGER) private personnelEditDialogManager: DialogManager<PersonnelDialogComponent>,
    @Inject(PERSONNEL_DELETE_DIALOG_MANAGER) private personnelDeleteDialogManager: DialogManager<ConfimationDialogComponent>,
  ) {
    super(menuState, tableCache, personnelInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<PersonnelDialogComponent>.builder(ADD_PERSONNEL_MENU_TITLE, PERSONNEL_GROUP, this.personnelEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_PERSONNEL_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_PERSONNEL_SNACKBAR_MESSAGE)
        .build(),
      MenuDialogCommand<PersonnelDialogComponent>.builder(EDIT_PERSONNEL_MENU_TITLE, PERSONNEL_GROUP, this.personnelEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_PERSONNEL_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_PERSONNEL_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand<ConfimationDialogComponent>.builder(REMOVE_PERSONNEL_MENU_TITLE, PERSONNEL_GROUP, this.personnelDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR_PERSONNEL,
          pluralName: PLURAL_PERSONNEL,
          countSupplier: () => this.tableCache.selectionCount
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
