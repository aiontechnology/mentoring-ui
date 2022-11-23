/*
 * Copyright 2021-2022 Aion Technology LLC
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
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../../implementation/command/menu-dialog-command';
import {SchoolWatchingDetailComponent} from '../../../../../implementation/component/school-watching-detail-component';
import {DataSource} from '../../../../../implementation/data/data-source';
import {ProgramAdmin} from '../../../../../models/program-admin/program-admin';
import {School} from '../../../../../models/school/school';
import {SchoolSession} from '../../../../../models/school/schoolsession';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {
  PROGRAM_ADMIN_DATA_SOURCE,
  PROGRAM_ADMIN_INSTANCE_CACHE
} from '../../../../../providers/global/global-program-admin-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../../providers/global/global-school-session-providers-factory';
import {ConfimationDialogComponent} from '../../../../shared/components/confimation-dialog/confimation-dialog.component';
import {
  ADD_PROGRAM_ADMIN_MENU_TITLE,
  ADD_PROGRAM_ADMIN_PANEL_TITLE,
  ADD_PROGRAM_ADMIN_SNACKBAR_MESSAGE,
  EDIT_PROGRAM_ADMIN_MENU_TITLE,
  EDIT_PROGRAM_ADMIN_PANEL_TITLE,
  EDIT_PROGRAM_ADMIN_SNACKBAR_MESSAGE,
  PLURAL_PROGRAM_ADMIN,
  REMOVE_PROGRAM_ADMIN_MENU_TITLE,
  REMOVE_PROGRAM_ADMIN_SNACKBAR_MESSAGE,
  SINGULAR_PROGRAM_ADMIN
} from '../../../other/school-constants';
import {
  PROGRAM_ADMIN_DETAIL_DELETE_DIALOG_MANAGER,
  PROGRAM_ADMIN_DETAIL_EDIT_DIALOG_MANAGER
} from '../../../providers/program-admin-providers-factory';
import {PROGRAM_ADMIN_GROUP} from '../../../school-manager.module';
import {ProgramAdminDialogComponent} from '../program-admin-dialog/program-admin-dialog.component';

@Component({
  selector: 'ms-program-admin-detail',
  templateUrl: './program-admin-detail.component.html',
  styleUrls: ['./program-admin-detail.component.scss']
})
export class ProgramAdminDetailComponent extends SchoolWatchingDetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    route: ActivatedRoute,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    // other
    @Inject(PROGRAM_ADMIN_DETAIL_EDIT_DIALOG_MANAGER) private programAdminEditDialogManager: DialogManager<ProgramAdminDialogComponent>,
    @Inject(PROGRAM_ADMIN_DETAIL_DELETE_DIALOG_MANAGER) private programAdminDeleteDialogManager: DialogManager<ConfimationDialogComponent>,
    @Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
    @Inject(PROGRAM_ADMIN_INSTANCE_CACHE) public programAdminInstanceCache: SingleItemCache<ProgramAdmin>,
  ) {
    super(menuState, route, schoolInstanceCache, schoolSessionInstanceCache)
  }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<ProgramAdminDialogComponent>.builder(ADD_PROGRAM_ADMIN_MENU_TITLE, PROGRAM_ADMIN_GROUP, this.programAdminEditDialogManager)
        .withSnackbarMessage(ADD_PROGRAM_ADMIN_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          panelTitle: ADD_PROGRAM_ADMIN_PANEL_TITLE
        }))
        .build()
        .enableIf(() => this.programAdminInstanceCache.item === undefined),
      MenuDialogCommand<ProgramAdminDialogComponent>.builder(EDIT_PROGRAM_ADMIN_MENU_TITLE, PROGRAM_ADMIN_GROUP, this.programAdminEditDialogManager)
        .withSnackbarMessage(EDIT_PROGRAM_ADMIN_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.programAdminInstanceCache.item,
          panelTitle: EDIT_PROGRAM_ADMIN_PANEL_TITLE
        }))
        .build()
        .enableIf(() => this.programAdminInstanceCache.item !== undefined),
      MenuDialogCommand<ConfimationDialogComponent>.builder(REMOVE_PROGRAM_ADMIN_MENU_TITLE, PROGRAM_ADMIN_GROUP, this.programAdminDeleteDialogManager)
        .withSnackbarMessage(REMOVE_PROGRAM_ADMIN_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.programAdminInstanceCache.item,
          singularName: SINGULAR_PROGRAM_ADMIN,
          pluralName: PLURAL_PROGRAM_ADMIN,
          countSupplier: () => 1
        }))
        .build()
        .enableIf(() => this.programAdminInstanceCache.item !== undefined)    ]
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected onSchoolChange(school: School) {
    this.programAdminDataSource.allValues()
      .then(admin => {
        this.programAdminInstanceCache.item = admin[0];
      });
  }
}
