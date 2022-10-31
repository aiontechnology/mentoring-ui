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
import {Cache} from '../../../implementation/data/cache';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {ProgramAdmin} from '../../../implementation/models/program-admin/program-admin';
import {School} from '../../../implementation/models/school/school';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {
  PROGRAM_ADMIN_CACHE,
  PROGRAM_ADMIN_INSTANCE_CACHE,
  PROGRAM_ADMIN_INSTANCE_CACHE_UPDATER,
  PROGRAM_ADMIN_URI_SUPPLIER
} from '../../../providers/global-program-admin-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../providers/global-school-providers-factory';
import {ProgramAdminDialogComponent} from '../components/school-detail-tabs/program-admin-dialog/program-admin-dialog.component';
import {PROGRAM_ADMIN_GROUP, PROGRAM_ADMIN_MENU} from '../school-manager.module';
import {programAdminMenuProvidersFactory} from './program-admin-menu-providers-factory';

export const PROGRAM_ADMIN_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<ProgramAdmin>>('program-admin-school-change-handler')

export function programAdminProvidersFactory() {
  return [
    ...programAdminMenuProvidersFactory<ProgramAdmin, ProgramAdminDialogComponent>(PROGRAM_ADMIN_MENU, PROGRAM_ADMIN_GROUP,
      'Program Admin', [], ProgramAdminDialogComponent, PROGRAM_ADMIN_INSTANCE_CACHE, PROGRAM_ADMIN_INSTANCE_CACHE_UPDATER),
    {
      provide: PROGRAM_ADMIN_SCHOOL_CHANGE_HANDLER,
      useFactory: (instanceCache: SingleItemCache<School>, uriSupplier: UriSupplier, cache: Cache<ProgramAdmin>) =>
        new SingleItemCacheSchoolChangeHandler<ProgramAdmin>('ProgramAdminSchoolChangeHandler', instanceCache, uriSupplier, cache),
      deps: [SCHOOL_INSTANCE_CACHE, PROGRAM_ADMIN_URI_SUPPLIER, PROGRAM_ADMIN_CACHE]
    },
  ]
}
