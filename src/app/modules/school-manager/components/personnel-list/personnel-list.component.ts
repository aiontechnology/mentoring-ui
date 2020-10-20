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

import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonnelCacheService } from '../../services/personnel/personnel-cache.service';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { PersonnelDialogComponent } from '../personnel-dialog/personnel-dialog.component';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';

@Component({
  selector: 'ms-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              public personnelCacheService: PersonnelCacheService) {
    console.log('Constructing PersonnelListComponent', PersonnelCacheService);
  }

  ngOnInit(): void {
    console.log('Establishing datasource with school id', this.schoolId);
    this.personnelCacheService.establishDatasource(this.schoolId);
    this.personnelCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding personnel list menus');
    PersonnelMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.personnelCacheService,
      this.schoolId);
  }

  ngAfterViewInit(): void {
    this.personnelCacheService.sort = this.sort;
    this.personnelCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'type', 'firstName', 'lastName'];
    } else {
      return ['select', 'type', 'firstName', 'lastName', 'email', 'workPhone', 'cellPhone'];
    }
  }

}

class PersonnelMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  personnelCacheService: PersonnelCacheService,
                  schoolId: string) {
    menuState.add(new NewDialogCommand(
      'Add Personnel',
      'personnel',
      PersonnelDialogComponent,
      'Personnel added',
      null,
      { schoolId },
      router,
      dialog,
      snackBar,
      () => true));
    menuState.add(new EditDialogCommand(
        'Edit Personnel',
        'personnel',
        PersonnelDialogComponent,
        'Personnel updated',
        null,
        router,
        dialog,
        snackBar,
        () => personnelCacheService.getFirstSelection(),
        () => personnelCacheService.clearSelection(),
        () => personnelCacheService.selection.selected.length === 1));
    menuState.add(new DeleteDialogCommand(
      'Remove Personnel',
      'personnel',
      ConfimationDialogComponent,
      'Personnel removed',
      'personnel',
      'personnel',
      router,
      dialog,
      snackBar,
      null,
      () => personnelCacheService.selectionCount,
      () => personnelCacheService.removeSelected(),
      () => { },
      () => personnelCacheService.selection.selected.length > 0));
  }

}
