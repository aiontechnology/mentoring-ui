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

import {PROGRAM_ADMIN_INSTANCE_CACHE} from '../../../providers/global-program-admin-providers-factory';
import {ProgramAdminDialogComponent} from '../components/school-detail-tabs/program-admin-dialog/program-admin-dialog.component';
import {ProgramAdmin} from '../../../implementation/models/program-admin/program-admin';
import {PROGRAM_ADMIN_GROUP, PROGRAM_ADMIN_MENU} from '../school-manager.module';
import {programAdminMenuProvidersFactory} from './program-admin-menu-providers-factory';

export function programAdminProvidersFactory() {
  return [
    ...programAdminMenuProvidersFactory<ProgramAdmin, ProgramAdminDialogComponent>(PROGRAM_ADMIN_MENU, PROGRAM_ADMIN_GROUP,
      'Program Admin', [], ProgramAdminDialogComponent, PROGRAM_ADMIN_INSTANCE_CACHE),
  ]
}
