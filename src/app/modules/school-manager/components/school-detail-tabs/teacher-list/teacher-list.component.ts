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
import {CommandArray} from '../../../../../implementation/component/menu-registering-component';
import {Teacher} from '../../../../../implementation/models/teacher/teacher';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../../implementation/table-cache/table-cache';
import {TEACHER_INSTANCE_CACHE} from '../../../../../providers/global/global-teacher-providers-factory';
import {
  TEACHER_DELETE_DIALOG_MANAGER,
  TEACHER_EDIT_DIALOG_MANAGER,
  TEACHER_TABLE_CACHE
} from '../../../providers/teacher-providers-factory';
import {TEACHER_GROUP, TEACHER_LIST_MENU} from '../../../school-manager.module';

@Component({
  selector: 'ms-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent extends ListComponent<Teacher> implements OnInit, OnDestroy {
  columns = ['select', 'firstName', 'lastName', 'email', 'cellPhone', 'grades']

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(TEACHER_LIST_MENU) menuCommands: CommandArray,
    @Inject(TEACHER_TABLE_CACHE) tableCache: TableCache<Teacher>,
    @Inject(TEACHER_INSTANCE_CACHE) teacherInstanceCache: SingleItemCache<Teacher>,
    // other
    @Inject(TEACHER_EDIT_DIALOG_MANAGER) private teacherEditDialogManager: DialogManager<Teacher>,
    @Inject(TEACHER_DELETE_DIALOG_MANAGER) private teacherDeleteDialogManager: DialogManager<Teacher>,
  ) {
    super(menuState, menuCommands, tableCache, teacherInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected registerMenus(menuState: MenuStateService, menuCommands: CommandArray) {
    menuState.add(
      MenuDialogCommand.builder('Add Teacher', TEACHER_GROUP, this.teacherEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: 'Add New Teacher'
        }))
        .withSnackbarMessage('Teacher Added')
        .build()
    )
    menuState.add(
      MenuDialogCommand.builder('Edit Teacher', TEACHER_GROUP, this.teacherEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: 'Edit Teacher'
        }))
        .withSnackbarMessage('Teacher Edited')
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1)
    )
    menuState.add(
      MenuDialogCommand.builder('Remove Teacher(s)', TEACHER_GROUP, this.teacherDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: 'teacher',
          pluralName: `teachers`,
          countSupplier: () => this.tableCache.selectionCount
        }))
        .withSnackbarMessage('Teacher(s) Removed')
        .build()
        .enableIf(() => this.tableCache.selection.selected.length > 0)
    )
  }

  protected override loadTableCache = async (): Promise<void> => {
    // do nothing
  }
}
