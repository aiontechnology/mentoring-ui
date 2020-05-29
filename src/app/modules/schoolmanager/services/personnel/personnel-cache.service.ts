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
import { SelectionManager } from '../selection-manager';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Personnel } from '../../models/personnel/personnel';
import { PersonnelService } from './personnel.service';

@Injectable()
export class PersonnelCacheService extends SelectionManager<Personnel>  {

  /** Datasource that is used by the table in the main-content component */
  dataSource: MatTableDataSource<Personnel>;

  /** An observable that provides changes to the set of Schools */
  private personnel: Observable<Personnel[]>;

  /** The sorting object */
  sort: MatSort;

  /** Tha paginator object */
  paginator: MatPaginator;

  /**
   * Constructor
   * @param personnelService The PersonnelService that is used for managing Personnel instances.
   */
  constructor(private personnelService: PersonnelService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.personnel = this.personnelService.personnel;
    this.personnelService.loadAll(schoolId);
    this.personnel.subscribe(p => {
      this.dataSource = new MatTableDataSource<Personnel>(p);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  protected doRemoveItem(items: Personnel[]): void {
    this.personnelService.removePersonnel(items);
  }

  protected getDataObservable(): Observable<Personnel[]> {
    return this.personnel;
  }

  protected getDataSize(): number {
    return this.dataSource.data.length;
  }

  protected getFilteredData(): Personnel[] {
    return this.dataSource.filteredData;
  }

}
