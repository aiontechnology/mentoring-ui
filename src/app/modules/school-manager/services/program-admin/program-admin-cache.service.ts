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
import { DatasourceManager } from '../../../shared/services/datasource-manager';
import { ProgramAdminRepositoryService } from './program-admin-repository.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ProgramAdminCacheService extends DatasourceManager<ProgramAdmin> {

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private programAdminService: ProgramAdminRepositoryService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.programAdminService.readAllProgramAdmins(schoolId);
    this.dataSource.data$ = this.programAdminService.items.pipe(
      tap(() => console.log('Creating new programAdmin datasource'))
    );
  }

  protected doRemoveItem(items: ProgramAdmin[]): void {
    this.programAdminService.deleteProgramAdmins(items);
  }

}
