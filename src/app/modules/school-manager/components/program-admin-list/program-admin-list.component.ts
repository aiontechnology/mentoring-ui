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

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterContentInit, AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { ProgramAdminCacheService } from '../../services/program-admin/program-admin-cache.service';
import { ProgramAdminDialogComponent } from '../program-admin-dialog/program-admin-dialog.component';

@Component({
  selector: 'ms-program-admin-list',
  templateUrl: './program-admin-list.component.html',
  styleUrls: ['./program-admin-list.component.scss']
})
export class ProgramAdminListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              public programAdminCacheService: ProgramAdminCacheService) {
    console.log('Constructing ProgramAdminListComponent', programAdminCacheService);
  }

  ngOnInit(): void {
    console.log('Establishing datasource with school id', this.schoolId);
    this.programAdminCacheService.establishDatasource(this.schoolId);
    this.programAdminCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding program admin list menus');
    ProgramAdminListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.programAdminCacheService,
      this.schoolId);
  }

  ngAfterViewInit(): void {
    this.programAdminCacheService.sort = this.sort;
    this.programAdminCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'firstName', 'lastName'];
    } else {
      return ['select', 'firstName', 'lastName', 'email', 'workPhone', 'cellPhone'];
    }
  }

}

class ProgramAdminListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  programAdminCacheSerice: ProgramAdminCacheService,
                  schoolId: string) {
    menuState.add(new NewDialogCommand(
      'Add Program Admin',
      'program-admin',
      ProgramAdminDialogComponent,
      'Program admin added',
      null,
      { schoolId },
      router,
      dialog,
      snackBar,
      () => true));
    menuState.add(new EditDialogCommand(
      'Edit Program Admin',
      'program-admin',
      ProgramAdminDialogComponent,
      'Program admin updated',
      null,
      router,
      dialog,
      snackBar,
      () => programAdminCacheSerice.getFirstSelection(),
      () => programAdminCacheSerice.clearSelection(),
      () => programAdminCacheSerice.selection.selected.length === 1));
    menuState.add(new DeleteDialogCommand(
      'Remove Program Admin(s)',
      'program-admin',
      ConfimationDialogComponent,
      'Program admin(s) removed',
      'program admin',
      'program admins',
      router,
      dialog,
      snackBar,
      null,
      () => programAdminCacheSerice.selectionCount,
      () => programAdminCacheSerice.removeSelected(),
      () => { },
      () => programAdminCacheSerice.selection.selected.length > 0));
  }

}
