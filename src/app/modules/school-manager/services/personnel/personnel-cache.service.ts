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
import { MatTableDataSource } from '@angular/material/table';
import { Personnel } from '../../models/personnel/personnel';
import { PersonnelService } from './personnel.service';
import { DatasourceManager } from '../datasource-manager';

@Injectable()
export class PersonnelCacheService extends DatasourceManager<Personnel>  {

  /**
   * Constructor
   * @param personnelService The PersonnelService that is used for managing Personnel instances.
   */
  constructor(private personnelService: PersonnelService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.elements = this.personnelService.personnel;
    this.personnelService.loadAll(schoolId);
    this.elements.subscribe(p => {
      this.dataSource.data = p;
    });
  }

  protected doRemoveItem(items: Personnel[]): void {
    this.personnelService.removePersonnel(items);
  }

}
