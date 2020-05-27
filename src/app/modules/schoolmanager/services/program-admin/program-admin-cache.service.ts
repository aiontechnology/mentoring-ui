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
import { ProgramAdmin } from '../../models/program-admin/program-admin';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProgramAdminService } from './program-admin.service';
import { SelectionManager } from '../selection-manager';

@Injectable()
export class ProgramAdminCacheService extends SelectionManager<ProgramAdmin> {

  /** Datasource that is used by the table in the main-content component */
  dataSource: MatTableDataSource<ProgramAdmin>;

  /** An observable that provides changes to the set of Schools */
  private programAdmins: Observable<ProgramAdmin[]>;

  /** The sorting object */
  sort: MatSort;

  /** Tha paginator object */
  paginator: MatPaginator;

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private programAdminService: ProgramAdminService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.programAdmins = this.programAdminService.programAdmins;
    this.programAdminService.loadAll(schoolId);
    this.programAdmins.subscribe(t => {
      this.dataSource = new MatTableDataSource<ProgramAdmin>(t);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  protected doRemoveItem(items: ProgramAdmin[]): void {
    this.programAdminService.removeProgramAdmins(items);
  }

  protected getDataObservable(): Observable<ProgramAdmin[]> {
    return this.programAdmins;
  }

  protected getDataSize(): number {
    return this.dataSource.data.length;
  }

  protected getFilteredData(): ProgramAdmin[] {
    return this.dataSource.filteredData;
  }

}
