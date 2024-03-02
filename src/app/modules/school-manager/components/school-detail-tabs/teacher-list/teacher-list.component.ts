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
import {Teacher} from '@models/teacher/teacher';
import {TeacherDialogComponent} from '@modules-school-manager/components/school-detail-tabs/teacher-dialog/teacher-dialog.component';
import {
  ADD_TEACHER_MENU_TITLE,
  ADD_TEACHER_PANEL_TITLE,
  ADD_TEACHER_SNACKBAR_MESSAGE,
  EDIT_TEACHER_MENU_TITLE,
  EDIT_TEACHER_PANEL_TITLE,
  EDIT_TEACHER_SNACKBAR_MESSAGE,
  PLURAL_TEACHER,
  REMOVE_TEACHER_MENU_TITLE,
  REMOVE_TEACHER_SNACKBAR_MESSAGE,
  SINGULAR_TEACHER
} from '@modules-school-manager/other/school-constants';
import {
  TEACHER_DELETE_DIALOG_MANAGER,
  TEACHER_EDIT_DIALOG_MANAGER,
  TEACHER_TABLE_CACHE
} from '@modules-school-manager/providers/teacher-providers-factory';
import {TEACHER_GROUP} from '@modules-school-manager/school-manager.module';
import {ConfirmationDialogComponent} from '@modules-shared/components/confirmation-dialog/confirmation-dialog.component';
import {TEACHER_INSTANCE_CACHE} from '@providers/global/global-teacher-providers-factory';

@Component({
  selector: 'ms-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent extends ListComponent<Teacher> implements OnInit, OnDestroy {
  columns = ['select', 'lastName', 'firstName', 'email', 'cellPhone', 'grades']

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    route: ActivatedRoute,
    @Inject(TEACHER_TABLE_CACHE) tableCache: TableCache<Teacher>,
    @Inject(TEACHER_INSTANCE_CACHE) teacherInstanceCache: SingleItemCache<Teacher>,
    // other
    @Inject(TEACHER_EDIT_DIALOG_MANAGER) private teacherEditDialogManager: DialogManager<TeacherDialogComponent>,
    @Inject(TEACHER_DELETE_DIALOG_MANAGER) private teacherDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
  ) {
    super(menuState, navService, route, tableCache, teacherInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(ADD_TEACHER_MENU_TITLE, TEACHER_GROUP, this.teacherEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_TEACHER_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_TEACHER_SNACKBAR_MESSAGE)
        .build(),
      MenuDialogCommand
        .builder(EDIT_TEACHER_MENU_TITLE, TEACHER_GROUP, this.teacherEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_TEACHER_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_TEACHER_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand
        .builder(REMOVE_TEACHER_MENU_TITLE, TEACHER_GROUP, this.teacherDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR_TEACHER,
          pluralName: PLURAL_TEACHER,
          nameSupplier: () => this.tableCache.selection.selected.map(selection => selection.fullName)
        }))
        .withSnackbarMessage(REMOVE_TEACHER_SNACKBAR_MESSAGE)
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
