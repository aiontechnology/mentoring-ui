/**
 * Copyright 2020 - 2021 Aion Technology LLC
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
import { DatasourceManagerRemovable } from '../datasource-manager/datasource-manager-removable';
import { SchoolRepositoryService } from './school-repository.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SchoolCacheService extends DatasourceManagerRemovable<School> {

  private isLoading$: BehaviorSubject<boolean>;

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private schoolService: SchoolRepositoryService) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
    console.log('Constructing a new SchoolCacheService instance');
  }

  /**
   * Load backend data to table.
   */
  @log
  establishDatasource(): void {
    this.schoolService.readAllSchools();
    this.dataSource.data$ = this.schoolService.items.pipe(
      tap(s => {
        console.log('Creating new school datasource');

        this.isLoading$.next(false);
        this.dataSource.data = s;

        this.dataSource.sortingDataAccessor = this.sortingDataAccessor;

        const savedFilter = this.dataSource?.filter;
        if (savedFilter) {
          console.log('Reading filter: ', savedFilter);
          this.dataSource.filter = savedFilter;
        }
      })
    );
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  protected doRemoveItem(items: School[]): Promise<void> {
    return this.schoolService.deleteSchools(items);
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
