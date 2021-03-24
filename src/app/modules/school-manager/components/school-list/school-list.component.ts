/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { SchoolDialogComponent } from '../school-dialog/school-dialog.component';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { SchoolCacheService } from 'src/app/modules/shared/services/school/school-cache.service';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { School } from 'src/app/modules/shared/models/school/school';

@Component({
  selector: 'ms-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss'],
  providers: [SchoolCacheService]
})
export class SchoolListComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.schoolCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.schoolCacheService.paginator = paginator;
    }
  }

  constructor(private dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private menuState: MenuStateService,
              private router: Router,
              public schoolCacheService: SchoolCacheService,
              private snackBar: MatSnackBar) {
    console.log('Constructing SchoolListComponent', schoolCacheService);
  }

  ngOnInit(): void {
    this.schoolCacheService.clearSelection();

    console.log('Adding school list menus');
    SchoolListMenuManager.addMenus(this.menuState,
                                   this.router,
                                   this.dialog,
                                   this.snackBar,
                                   (s: School) => this.jumpToNewItem(s),
                                   this.schoolCacheService);
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'city', 'state', 'district', 'phone', 'private'];
    }
  }

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: School): void {
    this.schoolCacheService.clearSelection();
    this.schoolCacheService.jumpToItem(newItem);
  }

}

class SchoolListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (s: School) => void,
                  schoolCacheService: SchoolCacheService): void {

    console.log('Constructing MenuHandler', schoolCacheService);

    menuState.add(new NewDialogCommand(
      'Create New School',
      'school',
      SchoolDialogComponent,
      'School added',
      ['/', 'schoolsmanager', 'schools'],
      undefined,
      router,
      dialog,
      snackBar,
      (s: School) => postAction(s),
      () => true));
    menuState.add(new EditDialogCommand(
      'Edit School',
      'school',
      SchoolDialogComponent,
      'School updated',
      ['/', 'schoolsmanager', 'schools'],
      router,
      dialog,
      snackBar,
      () => ({ model: schoolCacheService.getFirstSelection() }),
      (s: School) => postAction(s),
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
      () => schoolCacheService.selection.selected.length > 0));

  }

}
