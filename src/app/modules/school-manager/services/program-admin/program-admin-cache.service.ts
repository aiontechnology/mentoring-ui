/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { ProgramAdmin } from '../../models/program-admin/program-admin';
import { ProgramAdminService } from './program-admin.service';
import { DatasourceManager } from '../datasource-manager';

@Injectable()
export class ProgramAdminCacheService extends DatasourceManager<ProgramAdmin> {

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private programAdminService: ProgramAdminService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.elements = this.programAdminService.programAdmins;
    this.programAdminService.loadAll(schoolId);
    this.elements.subscribe(t => {
      this.dataSource.data = t;
    });
  }

  protected doRemoveItem(items: ProgramAdmin[]): void {
    this.programAdminService.removeProgramAdmins(items);
  }

}
