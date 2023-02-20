/*
 * Copyright 2020-2023 Aion Technology LLC
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
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../../implementation/command/dialog-manager';
import {MenuCommand} from '../../../../../implementation/command/menu-command';
import {MenuDialogCommand} from '../../../../../implementation/command/menu-dialog-command';
import {MenuExecutableCommand} from '../../../../../implementation/command/menu-executable-command';
import {SchoolWatchingDetailComponent} from '../../../../../implementation/component/school-watching-detail-component';
import {DataSource} from '../../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../../implementation/data/uri-supplier';
import {SnackbarManager} from '../../../../../implementation/managers/snackbar-manager';
import {NavigationService} from '../../../../../implementation/route/navigation.service';
import {RouteElementWatcher} from '../../../../../implementation/route/route-element-watcher.service';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {School} from '../../../../../models/school/school';
import {SchoolSession} from '../../../../../models/school/schoolsession';
import {StudentInbound} from '../../../../../models/student-inbound/student-inbound';
import {Student} from '../../../../../models/student/student';
import {BaseUri} from '../../../../../models/workflow/base-uri';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../../providers/global/global-school-session-providers-factory';
import {
  STUDENT_DATA_SOURCE,
  STUDENT_INSTANCE_CACHE,
  STUDENT_ROUTE_WATCHER
} from '../../../../../providers/global/global-student-providers-factory';
import {ConfirmationDialogComponent} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {STUDENT_INFO2_DATA_SOURCE, STUDENT_INFO_URI_SUPPLIER} from '../../../../shared/providers/workflow-providers-factory';
import {
  EDIT_STUDENT_MENU_TITLE,
  EDIT_STUDENT_PANEL_TITLE,
  EDIT_STUDENT_SNACKBAR_MESSAGE,
  PLURAL_STUDENT,
  REMOVE_STUDENT_MENU_TITLE,
  REMOVE_STUDENT_SNACKBAR_MESSAGE,
  REQUEST_TEACHER_INPUT,
  REQUEST_TEACHER_INPUT_SNACKBAR_MESSAGE,
  SINGULAR_STUDENT
} from '../../../other/student-constants';
import {STUDENT_DETAIL_DELETE_DIALOG_MANAGER, STUDENT_DETAIL_EDIT_DIALOG_MANAGER} from '../../../providers/student-providers-factory';
import {STUDENT_GROUP} from '../../../student-manager.module';
import {StudentDialogComponent} from '../../student-dialog/student-dialog.component';

@Component({
  selector: 'ms-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
})
export class StudentDetailComponent extends SchoolWatchingDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []

  constructor(
    // for super
    menuState: MenuStateService,
    route: ActivatedRoute,
    navService: NavigationService,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    // other
    @Inject(STUDENT_DETAIL_EDIT_DIALOG_MANAGER) private studentEditDialogManager: DialogManager<StudentDialogComponent>,
    @Inject(STUDENT_DETAIL_DELETE_DIALOG_MANAGER) private studentDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
    @Inject(STUDENT_DATA_SOURCE) private studentDataSource: DataSource<StudentInbound>,
    @Inject(STUDENT_INFO_URI_SUPPLIER) private studentInfoUriSupplier: UriSupplier,
    @Inject(STUDENT_INFO2_DATA_SOURCE) private studentInfoDataSource: DataSource<BaseUri>,
    @Inject(STUDENT_INSTANCE_CACHE) public studentInstanceCache: SingleItemCache<StudentInbound>,
    @Inject(STUDENT_ROUTE_WATCHER) private studentRouteWatcher: RouteElementWatcher<Student>,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {
    super(menuState, route, schoolInstanceCache, schoolSessionInstanceCache, navService)
  }

  protected get menus(): MenuCommand[] {
    return [
      MenuDialogCommand<StudentDialogComponent>.builder(EDIT_STUDENT_MENU_TITLE, STUDENT_GROUP, this.studentEditDialogManager)
        .withSnackbarMessage(EDIT_STUDENT_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.studentInstanceCache.item,
          panelTitle: EDIT_STUDENT_PANEL_TITLE
        }))
        .build()
        .enableIf(() => this.schoolSessionInstanceCache.item?.isCurrent),
      MenuDialogCommand<ConfirmationDialogComponent>.builder(REMOVE_STUDENT_MENU_TITLE, STUDENT_GROUP, this.studentDeleteDialogManager)
        .withSnackbarMessage(REMOVE_STUDENT_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.studentInstanceCache.item,
          singularName: SINGULAR_STUDENT,
          pluralName: PLURAL_STUDENT,
          nameSupplier: () => [this.studentInstanceCache.item.fullName],
        }))
        .build()
        .enableIf(() => this.schoolSessionInstanceCache.item?.isCurrent),
      new MenuExecutableCommand(REQUEST_TEACHER_INPUT, STUDENT_GROUP, false,
        () => {
          const snackbarManager = new SnackbarManager(this.snackbar)
          if (this.studentInstanceCache?.item?.teacher?.teacher.email !== null &&
            this.studentInstanceCache?.item?.teacher?.teacher.email.trim() !== '') {
            this.studentInfoUriSupplier.withSubstitution('schoolId', this.schoolInstanceCache.item.id)
            this.studentInfoUriSupplier.withSubstitution('studentId', this.studentInstanceCache.item.id)
            this.studentInfoDataSource.add(BaseUri.workflow())
            this.studentInstanceCache.item.teacherInfoWorkflowAllowed = false;
            snackbarManager.open(REQUEST_TEACHER_INPUT_SNACKBAR_MESSAGE)
          } else {
            if(this.studentInstanceCache?.item?.teacher === null) {
              snackbarManager.open("ERROR: No teacher set for student \u274C")
            } else {
              snackbarManager.open("ERROR: Teacher has no email address \u274C")
            }
          }
        })
        .enableIf(() => {
          return this.studentInstanceCache.item.teacherInfoWorkflowAllowed
        })
    ]
  }

  ngOnInit(): void {
    this.init()
    this.subscriptions.push(this.studentRouteWatcher.watch(this.route))
  }

  ngOnDestroy(): void {
    this.destroy()
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  protected doHandleBackButton = (navService: NavigationService): void =>
    navService.push({routeSpec: ['/studentmanager', 'schools', this.schoolInstanceCache.item.id], fragment: undefined})

  protected onSchoolChange(school: School) {
    this.router.navigate(['studentmanager', 'schools', school.id])
  }
}
