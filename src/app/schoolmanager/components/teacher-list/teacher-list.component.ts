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

import { Component, OnInit, ViewChild, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { TeacherService } from '../../services/teacher/teacher.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Teacher } from '../../models/teacher/teacher';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { take, mergeAll, filter, toArray } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'ms-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Teacher>;
  selection = new SelectionModel<Teacher>(true, []);

  private teachers: Observable<Teacher[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private teacherService: TeacherService,
              private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.teachers = this.teacherService.teachers;
    this.teachers.subscribe(t => {
      this.dataSource = new MatTableDataSource<Teacher>(t);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
   });
  }

  public establishDatasource(schoolId: string): void {
    this.teacherService.loadAll(schoolId);
  }

  ngAfterViewInit(): void {
    // this.schoolCacheService.sort = this.sort;
    // this.schoolCacheService.paginator = this.paginator;
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
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  removeSelected() {
    this.teachers.pipe(
      take(1),
      mergeAll(),
      filter(teacher => this.selection.isSelected(teacher)),
      toArray()
    ).subscribe(selected => {
      // this.teacherService.removeSchools(selected);
      this.selection.clear();
    });
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'email', 'phone', 'grades'];
    }
  }

}
