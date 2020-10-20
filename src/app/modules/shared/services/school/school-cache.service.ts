/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { log } from 'src/app/shared/logging-decorator';
import { School } from '../../models/school/school';
import { DatasourceManager } from '../datasource-manager';
import { SchoolRepositoryService } from './school-repository.service';

@Injectable()
export class SchoolCacheService extends DatasourceManager<School> {

  /** Binds to the filter input control. Used to clear the control when requested. */
  filterBinding: string;

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private schoolService: SchoolRepositoryService) {
    super();
    console.log('Constructing a new SchoolCacheService instance');
    this.establishDatasource();
  }

  /**
   * Setup the table datasource.
   */
  @log
  private establishDatasource(): void {
    this.elements = this.schoolService.schools;
    this.schoolService.readAllSchools();
    this.elements.subscribe(s => {
      console.log('Creating new school datasource');
      this.dataSource.data = s;

      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;

      const savedFilter = this.dataSource?.filter;
      if (savedFilter) {
        console.log('Reading filter: ', savedFilter);
        this.dataSource.filter = savedFilter;
      }
    });
  }

  /**
   * Get the value of the data source filter.
   */
  get filter() {
    return this.dataSource.filter;
  }

  protected doRemoveItem(items: School[]): void {
    this.schoolService.deleteSchools(items);
  }

  private sortingDataAccessor = (item: School, property: string) => {
    switch (property) {
      case 'street1': return item.address.street1;
      case 'street2': return item.address.street2;
      case 'city': return item.address.city;
      case 'state': return item.address.state;
      case 'zip': return item.address.zip;
      default: return item[property];
    }
  }

}
