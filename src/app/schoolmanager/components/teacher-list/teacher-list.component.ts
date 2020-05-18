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

import { Component, OnInit, ViewChild, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AddTeacherCommand, RemoveTeacherCommand } from '../../implementation/teacher-menu-commands';
import { MenuHandler } from '../../implementation/menu-handler';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherCacheService } from '../../services/teacher/teacher-cache.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ms-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit, AfterViewInit {

  private menuHandler: TeacherListMenuHandler;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;
  @Output() publishMenuHandler = new EventEmitter<MenuHandler>();

  constructor(public teacherCacheService: TeacherCacheService,
              private breakpointObserver: BreakpointObserver,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { 
    console.log('Constructing TeacherListComponent', teacherCacheService);
  }

  ngOnInit(): void {
    console.log('Establishing datasource with school id', this.schoolId);
    this.teacherCacheService.establishDatasource(this.schoolId);
    this.teacherCacheService.clearSelection();
    this.menuHandler = new TeacherListMenuHandler(this.router, this.dialog, this.snackBar, this.teacherCacheService, this.schoolId);
  }

  ngAfterViewInit(): void {
    this.teacherCacheService.sort = this.sort;
    this.teacherCacheService.paginator = this.paginator;
    this.publishMenuHandler.emit(this.menuHandler);
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'email', 'phone', 'grades'];
    }
  }

}

class TeacherListMenuHandler extends MenuHandler {

  constructor(router: Router, dialog: MatDialog, snackBar: MatSnackBar, teacherCacheSerice: TeacherCacheService, schoolId: string) {
    super();
    this.currentMenus.set('add-teacher', new AddTeacherCommand('Add Teacher', dialog, snackBar, schoolId));
    this.currentMenus.set('remove-teacher', new RemoveTeacherCommand(
      'Remove Teacher(s)',
      router,
      dialog,
      snackBar,
      null,
      () => teacherCacheSerice.removeSelected(),
      () => {},
      () => teacherCacheSerice.selection.selected.length > 0));
  }

}
