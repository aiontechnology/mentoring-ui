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
import {grades} from 'src/app/implementation/constants/grades';
import {SchoolSession} from 'src/app/implementation/models/school/schoolsession';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {equalsById} from '../../../../implementation/functions/comparison';
import {Contact} from '../../../../implementation/models/contact/contact';
import {School} from '../../../../implementation/models/school/school';
import {Student} from '../../../../implementation/models/student/student';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {MultiItemCache} from '../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global/global-school-providers-factory';
import {
  SCHOOL_SESSION_COLLECTION_CACHE,
  SCHOOL_SESSION_INSTANCE_CACHE
} from '../../../../providers/global/global-school-session-providers-factory';
import {STUDENT_INSTANCE_CACHE} from '../../../../providers/global/global-student-providers-factory';
import {ConfimationDialogComponent} from '../../../shared/components/confimation-dialog/confimation-dialog.component';
import {
  ADD_STUDENT_MENU_TITLE,
  ADD_STUDENT_PANEL_TITLE,
  ADD_STUDENT_SNACKBAR_MESSAGE,
  EDIT_STUDENT_MENU_TITLE,
  EDIT_STUDENT_PANEL_TITLE,
  EDIT_STUDENT_SNACKBAR_MESSAGE,
  PLURAL_STUDENT,
  REMOVE_STUDENT_MENU_TITLE,
  REMOVE_STUDENT_SNACKBAR_MESSAGE,
  SINGULAR_STUDENT
} from '../../other/student-constants';
import {
  STUDENT_LIST_DELETE_DIALOG_MANAGER,
  STUDENT_LIST_EDIT_DIALOG_MANAGER,
  STUDENT_TABLE_CACHE
} from '../../providers/student-providers-factory';
import {STUDENT_GROUP} from '../../student-manager.module';
import {StudentDialogComponent} from '../student-dialog/student-dialog.component';

@Component({
  selector: 'ms-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent extends ListComponent<Student> implements OnInit, OnDestroy {
  columns = ['select', 'firstName', 'lastName', 'studentId', 'grade', 'teacher', 'actualTime', 'contacts']
  compareSessions = equalsById

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    @Inject(STUDENT_TABLE_CACHE) tableCache: TableCache<Student>,
    @Inject(STUDENT_INSTANCE_CACHE) studentInstanceCache: SingleItemCache<Student>,
    // other
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
    @Inject(STUDENT_LIST_EDIT_DIALOG_MANAGER) private studentEditDialogManager: DialogManager<StudentDialogComponent>,
    @Inject(STUDENT_LIST_DELETE_DIALOG_MANAGER) private studentDeleteDialogManager: DialogManager<ConfimationDialogComponent>,
    @Inject(SCHOOL_SESSION_COLLECTION_CACHE) public schoolSessionCollectionCache: MultiItemCache<SchoolSession>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
  ) {
    super(menuState, navService, tableCache, studentInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<StudentDialogComponent>.builder(ADD_STUDENT_MENU_TITLE, STUDENT_GROUP, this.studentEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_STUDENT_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_STUDENT_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.schoolSessionInstanceCache.item?.isCurrent),
      MenuDialogCommand<StudentDialogComponent>.builder(EDIT_STUDENT_MENU_TITLE, STUDENT_GROUP, this.studentEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_STUDENT_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_STUDENT_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1)
        .enableIf(() => this.schoolSessionInstanceCache.item?.isCurrent),
      MenuDialogCommand<ConfimationDialogComponent>.builder(REMOVE_STUDENT_MENU_TITLE, STUDENT_GROUP, this.studentDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR_STUDENT,
          pluralName: PLURAL_STUDENT,
          countSupplier: () => this.tableCache.selectionCount
        }))
        .withSnackbarMessage(REMOVE_STUDENT_SNACKBAR_MESSAGE)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length > 0)
        .enableIf(() => this.schoolSessionInstanceCache.item?.isCurrent)
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
    navService.push({routeSpec: ['/studentmanager/schools', this.schoolInstanceCache.item.id], fragment: undefined})

  displayContact(contact: Contact): string {
    const name = contact.firstName + ' ' + contact.lastName;
    let contactInfo = contact.phone ?? '';
    if (contact.email !== null) {
      contactInfo += contactInfo ? ', ' + contact.email : contact.email;
    }
    return name + ': ' + contactInfo;
  }

  studentGrade(student: Student): string {
    return grades[student.grade].valueView;
  }
}
