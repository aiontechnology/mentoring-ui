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
import { EditSchoolDialogCommand, NewSchoolDialogCommand, RemoveSchoolCommand } from '../../implementation/school-menu-commands';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MenuStateService } from 'src/app/services/menu-state.service';

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
                  schoolCacheSerice: SchoolCacheService): void {
    console.log('Constructing MenuHandler', schoolCacheSerice);
    menuState.add(new NewSchoolDialogCommand('Create New School', router, dialog, snackBar));
    menuState.add(new EditSchoolDialogCommand(
      'Edit School',
      router,
      dialog,
      snackBar,
      () => schoolCacheSerice.getFirstSelection(),
      () => schoolCacheSerice.clearSelection(),
      () => schoolCacheSerice.selection.selected.length === 1));
    menuState.add(new RemoveSchoolCommand(
      'Remove School(s)',
      router,
      dialog,
      snackBar,
      null,
      () => schoolCacheSerice.selectionCount,
      () => schoolCacheSerice.removeSelected(),
      () => { },
      () => schoolCacheSerice.selection.selected.length > 0));
  }

}
