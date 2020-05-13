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

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SchoolCacheService } from '../../services/school/school-cache.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MenuReceiver } from '../../implementation/menu-receiver';
import { EditSchoolDialogCommand, NewSchoolDialogCommand, RemoveSchoolCommand } from '../../implementation/menu-commands';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MenuHandler } from '../../implementation/menu-handler';

@Component({
  selector: 'ms-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit, AfterViewInit {

  private menuHandler: SchoolListMenuHandler;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public schoolCacheService: SchoolCacheService,
              private breakpointObserver: BreakpointObserver,
              router: Router,
              dialog: MatDialog,
              snackBar: MatSnackBar) {
    console.log('Constructing SchoolListComponent', schoolCacheService);
    this.menuHandler = new SchoolListMenuHandler(router, dialog, snackBar, this.schoolCacheService);
  }

  ngOnInit(): void {
    this.schoolCacheService.establishDatasource();
    this.schoolCacheService.clearSelection();
  }

  ngAfterViewInit(): void {
    this.schoolCacheService.sort = this.sort;
    this.schoolCacheService.paginator = this.paginator;
    this.menuHandler.sendMenusToParent();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'city', 'state', 'district', 'phone', 'private'];
    }
  }

}

class SchoolListMenuHandler extends MenuHandler {

  private parent: MenuReceiver;

  constructor(router: Router, dialog: MatDialog, snackBar: MatSnackBar, schoolCacheSerice: SchoolCacheService) {
    super();
    console.log('Constructing MenuHandler', schoolCacheSerice);
    this.currentMenus.set('add-school', new NewSchoolDialogCommand(router, dialog, snackBar));
    this.currentMenus.set('edit-school', new EditSchoolDialogCommand(
      router,
      dialog,
      snackBar,
      () => schoolCacheSerice.getFirstSelection(),
      () => schoolCacheSerice.clearSelection(),
      () => schoolCacheSerice.selection.selected.length === 1));
    this.currentMenus.set('remove-school', new RemoveSchoolCommand(
      router,
      dialog,
      snackBar,
      null,
      () => schoolCacheSerice.removeSelected(),
      () => {},
      () => schoolCacheSerice.selection.selected.length > 0));
  }

  sendMenusToParent() {
    console.log('Sending menus to parent', this.currentMenus);
    this.parent.setMenus(this.currentMenus);
  }

  set parant(parent: MenuReceiver) {
    console.log('Setting parent', parent);
    this.parent = parent;
  }

}
