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

import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SchoolCacheService } from '../../services/school/school-cache.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { SchoolDialogComponent } from '../school-dialog/school-dialog.component';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';

@Component({
  selector: 'ms-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private menuState: MenuStateService,
              private router: Router,
              public schoolCacheService: SchoolCacheService,
              private snackBar: MatSnackBar) {
    console.log('Constructing SchoolListComponent', schoolCacheService);
  }

  ngOnInit(): void {
    this.schoolCacheService.establishDatasource();
    this.schoolCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding school list menus');
    this.menuState.clear();
    SchoolListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.schoolCacheService);
  }

  ngAfterViewInit(): void {
    this.schoolCacheService.sort = this.sort;
    this.schoolCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'city', 'state', 'district', 'phone', 'private'];
    }
  }

}

class SchoolListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  schoolCacheService: SchoolCacheService): void {
    console.log('Constructing MenuHandler', schoolCacheService);
    menuState.add(new NewDialogCommand(
      'Create New School',
      'school',
      SchoolDialogComponent,
      'School added',
      ['/', 'schoolmanager', 'schools'],
      undefined,
      router,
      dialog,
      snackBar));
    menuState.add(new EditDialogCommand(
      'Edit School',
      'school',
      SchoolDialogComponent,
      'School updated',
      ['/', 'schoolmanager', 'schools'],
      router,
      dialog,
      snackBar,
      () => schoolCacheService.getFirstSelection(),
      () => schoolCacheService.clearSelection(),
      () => schoolCacheService.selection.selected.length === 1));
    menuState.add(new DeleteDialogCommand(
      'Remove School(s)',
      'school',
      ConfimationDialogComponent,
      'School(s) removed',
      'school',
      'schools',
      router,
      dialog,
      snackBar,
      null,
      () => schoolCacheService.selectionCount,
      () => schoolCacheService.removeSelected(),
      () => { },
      () => schoolCacheService.selection.selected.length > 0));
  }

}
