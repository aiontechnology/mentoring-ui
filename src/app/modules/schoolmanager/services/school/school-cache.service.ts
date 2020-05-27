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
import { School } from '../../models/school/school';
import { SchoolService } from './school.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionManager } from '../selection-manager';

@Injectable()
export class SchoolCacheService extends SelectionManager<School> {

  /** Datasource that is used by the table in the main-content component */
  dataSource: MatTableDataSource<School>;

  /** An observable that provides changes to the set of Schools */
  private schools: Observable<School[]>;

  /** The sorting object */
  sort: MatSort;

  /** Tha paginator object */
  paginator: MatPaginator;

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private schoolService: SchoolService) {
    super();
  }

  /**
   * Apply a filter to the table datasource
   * @param filterValue The value to use as a filter
   */
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearSelection(): void {
    this.selection.clear();
  }

  /**
   * Setup the table datasource.
   */
  establishDatasource(): void {
    this.schools = this.schoolService.schools;
    this.schoolService.loadAll();
    this.schools.subscribe(s => {
      console.log('Creating new datasource');
      const savedFilter = this.dataSource?.filter;
      this.dataSource = new MatTableDataSource<School>(s);
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (savedFilter) {
        console.log('Readding filter: ', savedFilter);
        this.dataSource.filter = savedFilter;
      }
    });
  }

  protected doRemoveItem(items: School[]): void {
    this.schoolService.removeSchools(items);
  }

  protected getDataObservable(): Observable<School[]> {
    return this.schools;
  }

  protected getDataSize(): number {
    return this.dataSource.data.length;
  }

  protected getFilteredData(): School[] {
    return this.dataSource.filteredData;
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
