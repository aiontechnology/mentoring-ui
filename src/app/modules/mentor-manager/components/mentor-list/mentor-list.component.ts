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
import {Mentor} from '../../../../models/mentor/mentor';
import {School} from '../../../../models/school/school';
import {MENTOR_INSTANCE_CACHE} from '../../../../providers/global/global-mentor-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global/global-school-providers-factory';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
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
    navService: NavigationService,
    @Inject(MENTOR_TABLE_CACHE) tableCache: TableCache<Mentor>,
    @Inject(MENTOR_INSTANCE_CACHE) mentorInstanceCache: SingleItemCache<Mentor>,
    // other
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
    @Inject(MENTOR_LIST_EDIT_DIALOG_MANAGER) private mentorEditDialogManager: DialogManager<MentorDialogComponent>,
    @Inject(MENTOR_LIST_DELETE_DIALOG_MANAGER) private mentorDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
  ) {
    super(menuState, navService, tableCache, mentorInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected override get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(ADD_MENU_TITLE, MENTOR_GROUP, this.mentorEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_SNACKBAR_MESSAGE)
        .build(),
      MenuDialogCommand
        .builder(EDIT_MENU_TITLE, MENTOR_GROUP, this.mentorEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand
        .builder(REMOVE_MENU_TITLE, MENTOR_GROUP, this.mentorDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR,
          pluralName: PLURAL,
          nameSupplier: () => this.tableCache.selection.selected.map(selection => selection.fullName),
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

  protected doHandleBackButton = (navService: NavigationService) =>
    navService.push({routeSpec: ['/mentormanager/schools', this.schoolInstanceCache.item.id], fragment: undefined})
}
