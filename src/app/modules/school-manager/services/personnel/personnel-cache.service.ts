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
import { Personnel } from '../../models/personnel/personnel';
import { DatasourceManager } from '../../../shared/services/datasource-manager';
import { PersonnelRepositoryService } from './personnel-repository.service';

@Injectable()
export class PersonnelCacheService extends DatasourceManager<Personnel>  {

  /**
   * Constructor
   * @param personnelService The PersonnelService that is used for managing Personnel instances.
   */
  constructor(private personnelService: PersonnelRepositoryService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.elements = this.personnelService.items;
    this.personnelService.readAllPersonnel(schoolId);
    this.elements.subscribe(p => {
      this.dataSource.data = p;
    });
  }

  protected doRemoveItem(items: Personnel[]): void {
    this.personnelService.deletePersonnel(items);
  }

}
