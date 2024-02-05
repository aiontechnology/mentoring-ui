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
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {School} from '../../../../models/school/school';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global/global-school-providers-factory';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  ADD_SCHOOL_MENU_TITLE,
  ADD_SCHOOL_PANEL_TITLE,
  ADD_SCHOOL_SNACKBAR_MESSAGE,
  EDIT_SCHOOL_MENU_TITLE,
  EDIT_SCHOOL_PANEL_TITLE,
  EDIT_SCHOOL_SNACKBAR_MESSAGE,
  PLURAL_SCHOOL,
  REMOVE_SCHOOL_MENU_TITLE,
  REMOVE_SCHOOL_SNACKBAR_MESSAGE,
  SINGULAR_SCHOOL
} from '../../other/school-constants';
import {
  SCHOOL_LIST_DELETE_DIALOG_MANAGER,
  SCHOOL_LIST_EDIT_DIALOG_MANAGER,
  SCHOOL_TABLE_CACHE
} from '../../providers/school-providers-factory';
import {SCHOOL_GROUP} from '../../school-manager.module';
import {SchoolDialogComponent} from '../school-dialog/school-dialog.component';

@Component({
  selector: 'ms-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent extends ListComponent<School> implements OnInit, OnDestroy {
  columns = ['select', 'name', 'city', 'state', 'district', 'phone', 'isPrivate']

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    @Inject(SCHOOL_TABLE_CACHE) tableCache: TableCache<School>,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>,
    // other
    @Inject(SCHOOL_LIST_EDIT_DIALOG_MANAGER) private schoolEditDialogManager: DialogManager<SchoolDialogComponent>,
    @Inject(SCHOOL_LIST_DELETE_DIALOG_MANAGER) private schoolDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
  ) {
    super(menuState, navService, tableCache, schoolInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(ADD_SCHOOL_MENU_TITLE, SCHOOL_GROUP, this.schoolEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_SCHOOL_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_SCHOOL_SNACKBAR_MESSAGE)
        .build(),
      MenuDialogCommand
        .builder(EDIT_SCHOOL_MENU_TITLE, SCHOOL_GROUP, this.schoolEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_SCHOOL_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_SCHOOL_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand
        .builder(REMOVE_SCHOOL_MENU_TITLE, SCHOOL_GROUP, this.schoolDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR_SCHOOL,
          pluralName: PLURAL_SCHOOL,
          nameSupplier: () => this.tableCache.selection.selected.map(selection => selection.name)
        }))
        .withSnackbarMessage(REMOVE_SCHOOL_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length > 0)
    ]
  }

  ngOnInit(): void {
    this.menuState.reset()
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService) =>
    navService.push({routeSpec: ['/schoolsmanager'], fragment: undefined})
}
