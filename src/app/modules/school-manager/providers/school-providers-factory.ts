/*
 * Copyright 2022 Aion Technology LLC
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

import {InjectionToken} from '@angular/core';
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../implementation/command/menu-dialog-command';
import {DataSource} from '../../../implementation/data/data-source';
import {Mentor} from '../../../implementation/models/mentor/mentor';
import {School} from '../../../implementation/models/school/school';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailDialogManagerProviders} from '../../../providers/dialog/detail-dialog-manager-providers';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {
  SCHOOL_DATA_SOURCE,
  SCHOOL_INSTANCE_CACHE,
  SCHOOL_INSTANCE_CACHE_UPDATER
} from '../../../providers/global/global-school-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {SchoolDialogComponent} from '../components/school-dialog/school-dialog.component';

export const SCHOOL_TABLE_CACHE = new InjectionToken<TableCache<School>>('school-table-cache')
export const SCHOOL_INVITE_STUDENT = new InjectionToken<(dataSupplier) => MenuDialogCommand<Mentor>>('school-invite-student')
export const SCHOOL_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<SchoolDialogComponent>>('school-detail-edit-dialog-manager')
export const SCHOOL_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('school-detail-delete-dialog-manager')
export const SCHOOL_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<SchoolDialogComponent>>('school-list-edit-dialog-manager')
export const SCHOOL_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('school-list-delete-dialog-manager')

export function schoolProvidersFactory() {
  return [
    ...detailDialogManagerProviders(
      SCHOOL_DETAIL_EDIT_DIALOG_MANAGER,
      SCHOOL_DETAIL_DELETE_DIALOG_MANAGER,
      SchoolDialogComponent,
      SCHOOL_TABLE_CACHE,
      ['/schoolsmanager'],
      SCHOOL_INSTANCE_CACHE,
      SCHOOL_INSTANCE_CACHE_UPDATER
    ),
    ...listDialogManagerProviders<School, SchoolDialogComponent, TableCache<School>>(
      SCHOOL_LIST_EDIT_DIALOG_MANAGER,
      SCHOOL_LIST_DELETE_DIALOG_MANAGER,
      SchoolDialogComponent,
      SCHOOL_TABLE_CACHE
    ),
    {
      provide: SCHOOL_TABLE_CACHE,
      useFactory: (dataSource: DataSource<School>) => new TableCache('SchoolTableCache', dataSource),
      deps: [SCHOOL_DATA_SOURCE]
    },
  ]
}
