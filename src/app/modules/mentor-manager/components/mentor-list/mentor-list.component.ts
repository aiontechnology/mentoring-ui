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
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {Mentor} from '../../../../implementation/models/mentor/mentor';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {MENTOR_INSTANCE_CACHE} from '../../../../providers/global/global-mentor-providers-factory';
import {ConfimationDialogComponent} from '../../../shared/components/confimation-dialog/confimation-dialog.component';
import {MENTOR_GROUP} from '../../mentor-manager.module';
import {
  ADD_MENU_TITLE,
  ADD_PANEL_TITLE,
  ADD_SNACKBAR_MESSAGE,
  EDIT_MENU_TITLE,
  EDIT_PANEL_TITLE,
  EDIT_SNACKBAR_MESSAGE,
  PLURAL,
  REMOVE_MENU_TITLE,
  REMOVE_SNACKBAR_MESSAGE,
  SINGULAR
} from '../../other/mentor-constants';
import {
  MENTOR_LIST_DELETE_DIALOG_MANAGER,
  MENTOR_LIST_EDIT_DIALOG_MANAGER,
  MENTOR_TABLE_CACHE
} from '../../providers/mentor-providers-factory';
import {MentorDialogComponent} from '../mentor-dialog/mentor-dialog.component';

@Component({
  selector: 'ms-mentor-list',
  templateUrl: './mentor-list.component.html',
  styleUrls: ['./mentor-list.component.scss'],
})
export class MentorListComponent extends ListComponent<Mentor> implements OnInit, OnDestroy {
  columns = ['select', 'firstName', 'lastName', 'availability', 'cellPhone', 'email', 'mediaReleaseSigned', 'backgroundCheckCompleted']

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(MENTOR_TABLE_CACHE) tableCache: TableCache<Mentor>,
    @Inject(MENTOR_INSTANCE_CACHE) mentorInstanceCache: SingleItemCache<Mentor>,
    // other
    @Inject(MENTOR_LIST_EDIT_DIALOG_MANAGER) private mentorEditDialogManager: DialogManager<MentorDialogComponent>,
    @Inject(MENTOR_LIST_DELETE_DIALOG_MANAGER) private mentorDeleteDialogManager: DialogManager<ConfimationDialogComponent>,
  ) {
    super(menuState, tableCache, mentorInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<MentorDialogComponent>.builder(ADD_MENU_TITLE, MENTOR_GROUP, this.mentorEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_SNACKBAR_MESSAGE)
        .build(),
      MenuDialogCommand<MentorDialogComponent>.builder(EDIT_MENU_TITLE, MENTOR_GROUP, this.mentorEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand<ConfimationDialogComponent>.builder(REMOVE_MENU_TITLE, MENTOR_GROUP, this.mentorDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR,
          pluralName: PLURAL,
          countSupplier: () => this.tableCache.selectionCount
        }))
        .withSnackbarMessage(REMOVE_SNACKBAR_MESSAGE)
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
}
