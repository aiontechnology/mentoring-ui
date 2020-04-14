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
import { SelectionModel } from '@angular/cdk/collections';
import { School } from '../models/school';
import { SchoolService } from './school.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { filter, concatAll, map, toArray, mergeAll, tap, take } from 'rxjs/operators';

@Injectable()
export class SchoolCacheService {

  /** Datasource that is used by the table in the main-content component */
  dataSource: MatTableDataSource<School>;

  /** An observable that provides changes to the set of Schools */
  schools: Observable<School[]>;

  /** Manages the selection(s) of schools in the main-content table */
  selection = new SelectionModel<School>(true, []);

  /** The sorting object */
  sort: MatSort;

  /** Tha paginator object */
  paginator: MatPaginator;

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private schoolService: SchoolService) { }

  /**
   * Apply a filter to the table datasource
   * @param filterValue The value to use as a filter
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  /**
   * Setup the table datasource.
   */
  establishDatasource(): void {
    this.schools = this.schoolService.schools;
    this.schoolService.loadAll();
    this.schools.subscribe(s => {
      this.dataSource = new MatTableDataSource<School>(s);
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeSelected() {
    this.schools.pipe(
      take(1),
      mergeAll(),
      filter(school => this.selection.isSelected(school)),
      toArray()
    ).subscribe(selected => {
      this.schoolService.removeSchools(selected);
      this.selection.clear();
    });
  }

  private sortingDataAccessor = (item, property) => {
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
