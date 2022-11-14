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
import {Cache} from '../../../implementation/data/cache';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {ProgramAdmin} from '../../../implementation/models/program-admin/program-admin';
import {SchoolChangeDataSourceResetter} from '../../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {
  PROGRAM_ADMIN_CACHE,
  PROGRAM_ADMIN_INSTANCE_CACHE,
  PROGRAM_ADMIN_INSTANCE_CACHE_UPDATER,
  PROGRAM_ADMIN_SCHOOL_CHANGE_RESETTER,
  PROGRAM_ADMIN_URI_SUPPLIER
} from '../../../providers/global/global-program-admin-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {ProgramAdminDialogComponent} from '../components/school-detail-tabs/program-admin-dialog/program-admin-dialog.component';
import {detailDialogManagerProviders} from './program-admin-dialog/detail-dialog-manager-providers';

export const PROGRAM_ADMIN_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<ProgramAdmin>>('program-admin-school-change-handler')
export const PROGRAM_ADMIN_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<ProgramAdminDialogComponent>>('program-admin-detail-edit-dialog-manager')
export const PROGRAM_ADMIN_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('program-admin-detail-delete-dialog-manager')

export function programAdminProvidersFactory() {
  return [
    ...detailDialogManagerProviders<ProgramAdmin, ProgramAdminDialogComponent>(
      PROGRAM_ADMIN_DETAIL_EDIT_DIALOG_MANAGER,
      PROGRAM_ADMIN_DETAIL_DELETE_DIALOG_MANAGER,
      ProgramAdminDialogComponent,
      [],
      PROGRAM_ADMIN_INSTANCE_CACHE,
      PROGRAM_ADMIN_INSTANCE_CACHE_UPDATER
    ),
    {
      provide: PROGRAM_ADMIN_SCHOOL_CHANGE_HANDLER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<ProgramAdmin>, uriSupplier: UriSupplier, cache: Cache<ProgramAdmin>) =>
        new SingleItemCacheSchoolChangeHandler<ProgramAdmin>('ProgramAdminSchoolChangeHandler', schoolChangeResetter, uriSupplier, cache),
      deps: [PROGRAM_ADMIN_SCHOOL_CHANGE_RESETTER, PROGRAM_ADMIN_URI_SUPPLIER, PROGRAM_ADMIN_CACHE]
    },
  ]
}
