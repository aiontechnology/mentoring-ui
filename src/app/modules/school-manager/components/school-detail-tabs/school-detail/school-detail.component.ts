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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DialogManager} from '@implementation/command/dialog-manager';
import {MenuDialogCommand} from '@implementation/command/menu-dialog-command';
import {DetailComponent} from '@implementation/component/detail-component';
import {Cache} from '@implementation/data/cache';
import {NavigationService} from '@implementation/route/navigation.service';
import {MenuStateService} from '@implementation/services/menu-state.service';
import {MultiItemCache} from '@implementation/state-management/multi-item-cache';
import {SingleItemCache} from '@implementation/state-management/single-item-cache';
import {School} from '@models/school/school';
import {SchoolSession} from '@models/school/schoolsession';
import {RequestPostAssessmentComponent} from '@modules-school-manager/components/request-post-assessment/request-post-assessment.component';
import {SchoolDialogComponent} from '@modules-school-manager/components/school-dialog/school-dialog.component';
import {
  SchoolSessionDialogComponent
} from '@modules-school-manager/components/school-session/school-session-dialog/school-session-dialog.component';
import {
  ADD_SCHOOL_SESSION_SNACKBAR_MESSAGE,
  ADD_SCHOOL_SESSION_TITLE,
  EDIT_SCHOOL_MENU_TITLE,
  EDIT_SCHOOL_PANEL_TITLE,
  EDIT_SCHOOL_SNACKBAR_MESSAGE,
  PLURAL_SCHOOL,
  POST_ASSESSMENT_PANEL_TITLE,
  POST_ASSESSMENT_SNACKBAR_MESSAGE,
  REMOVE_SCHOOL_MENU_TITLE,
  REMOVE_SCHOOL_SNACKBAR_MESSAGE,
  REQUEST_POST_ASSESSMENT_MENU_TITLE,
  SINGULAR_SCHOOL
} from '@modules-school-manager/other/school-constants';
import {
  SCHOOL_DETAIL_DELETE_DIALOG_MANAGER,
  SCHOOL_DETAIL_EDIT_DIALOG_MANAGER,
  SCHOOL_SESSION_ADD_DIALOG_MANAGER
} from '@modules-school-manager/providers/school-providers-factory';
import {POST_ASSESSMENT_DIALOG_MANAGER} from '@modules-school-manager/school-manager.module';
import {ConfirmationDialogComponent} from '@modules-shared/components/confirmation-dialog/confirmation-dialog.component';
import {InviteStudentComponent} from '@modules-shared/components/invite-student/invite-student.component';
import {
  INVITE_STUDENT_MENU_TITLE,
  INVITE_STUDENT_PANEL_TITLE,
  INVITE_STUDENT_SNACKBAR_MESSAGE,
  SCHOOL_GROUP
} from '@modules-shared/other/shared-constants';
import {INVITATION_EDIT_DIALOG_MANAGER,} from '@modules-shared/shared.module';
import {SCHOOL_INSTANCE_CACHE} from '@providers/global/global-school-providers-factory';
import {
  SCHOOL_SESSION_CACHE,
  SCHOOL_SESSION_COLLECTION_CACHE,
  SCHOOL_SESSION_INSTANCE_CACHE
} from '@providers/global/global-school-session-providers-factory';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent extends DetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    route: ActivatedRoute,
    navService: NavigationService,
    // other
    @Inject(SCHOOL_DETAIL_EDIT_DIALOG_MANAGER) private schoolEditDialogManager: DialogManager<SchoolDialogComponent>,
    @Inject(SCHOOL_DETAIL_DELETE_DIALOG_MANAGER) private schoolDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
    @Inject(SCHOOL_SESSION_ADD_DIALOG_MANAGER) private schoolSessionAddDialogManager: DialogManager<SchoolSessionDialogComponent>,
    @Inject(INVITATION_EDIT_DIALOG_MANAGER) private invitationEditDialogManager: DialogManager<InviteStudentComponent>,
    @Inject(POST_ASSESSMENT_DIALOG_MANAGER) private postAssessmentDialogManager: DialogManager<RequestPostAssessmentComponent>,
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    @Inject(SCHOOL_SESSION_CACHE) private schoolSessionCache: Cache<SchoolSession>,
    @Inject(SCHOOL_SESSION_COLLECTION_CACHE) private schoolSessionCollectionCache: MultiItemCache<SchoolSession>,
  ) {
    super(menuState, route, navService)
  }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand.builder(EDIT_SCHOOL_MENU_TITLE, SCHOOL_GROUP, this.schoolEditDialogManager)
        .withSnackbarMessage(EDIT_SCHOOL_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.schoolInstanceCache.item,
          panelTitle: EDIT_SCHOOL_PANEL_TITLE
        }))
        .withAdminOnly(true)
        .build(),
      MenuDialogCommand.builder(REMOVE_SCHOOL_MENU_TITLE, SCHOOL_GROUP, this.schoolDeleteDialogManager)
        .withSnackbarMessage(REMOVE_SCHOOL_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.schoolInstanceCache.item,
          singularName: SINGULAR_SCHOOL,
          pluralName: PLURAL_SCHOOL,
          nameSupplier: () => [this.schoolInstanceCache.item.name],
        }))
        .withAdminOnly(true)
        .build(),
      MenuDialogCommand.builder(ADD_SCHOOL_SESSION_TITLE, SCHOOL_GROUP, this.schoolSessionAddDialogManager)
        .withSnackbarMessage(ADD_SCHOOL_SESSION_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          width: '700px',
          disableClose: true,
          data: {schoolId: this.schoolInstanceCache.item.id},
          reloadCacheFunction: (schoolSession: SchoolSession) => {
            if (schoolSession) {
              this.schoolSessionInstanceCache.item = schoolSession
              this.schoolInstanceCache.item.currentSession = schoolSession
              this.schoolSessionCache.reset()
              this.schoolSessionCollectionCache.load()
            }
          },
        }))
        .build(),
      MenuDialogCommand.builder(INVITE_STUDENT_MENU_TITLE, SCHOOL_GROUP, this.invitationEditDialogManager)
        .withSnackbarMessage(INVITE_STUDENT_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          panelTitle: INVITE_STUDENT_PANEL_TITLE
        }))
        .build(),
      MenuDialogCommand.builder(REQUEST_POST_ASSESSMENT_MENU_TITLE, SCHOOL_GROUP, this.postAssessmentDialogManager)
        .withSnackbarMessage(POST_ASSESSMENT_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          panelTitle: POST_ASSESSMENT_PANEL_TITLE
        }))
        .build()
    ]
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService): void =>
    navService.push({routeSpec: ['/schoolsmanager'], fragment: undefined, filter: null})
}

