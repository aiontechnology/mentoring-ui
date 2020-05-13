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
import { Teacher } from '../../models/teacher/teacher';
import { TeacherService } from './teacher.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Injectable()
export class TeacherCacheService extends SelectionManager<Teacher>  {

  /** Datasource that is used by the table in the main-content component */
  dataSource: MatTableDataSource<Teacher>;

  /** An observable that provides changes to the set of Schools */
  private teachers: Observable<Teacher[]>;

  /** The sorting object */
  sort: MatSort;

  /** Tha paginator object */
  paginator: MatPaginator;

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private teacherService: TeacherService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.teachers = this.teacherService.teachers;
    this.teacherService.loadAll(schoolId);
    this.teachers.subscribe(t => {
      this.dataSource = new MatTableDataSource<Teacher>(t);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  protected doRemoveItem(items: Teacher[]): void {
    this.teacherService.removeTeachers(items);
  }

  protected getDataObservable(): Observable<Teacher[]> {
    return this.teachers;
  }

  protected getDataSize(): number {
    return this.dataSource.data.length;
  }

  protected getFilteredData(): Teacher[] {
    return this.dataSource.filteredData;
  }

}
