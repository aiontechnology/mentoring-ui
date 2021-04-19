/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
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
import { Personnel } from '../../models/personnel/personnel';

@Component({
  selector: 'ms-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss'],
  providers: [PersonnelCacheService]
})
export class PersonnelListComponent implements OnInit, AfterViewInit {

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

    console.log('Adding personnel list menus');
    PersonnelMenuManager.addMenus(this.menuState,
                                  this.router,
                                  this.dialog,
                                  this.snackBar,
                                  (p: Personnel) => this.jumpToNewItem(p),
                                  this.personnelCacheService,
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

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: Personnel): void {
    this.personnelCacheService.clearSelection();
    this.personnelCacheService.jumpToItem(newItem);
  }

}

class PersonnelMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (p: Personnel) => void,
                  personnelCacheService: PersonnelCacheService,
                  schoolId: string): void {

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
      (p: Personnel) => postAction(p),
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
      () => ({ model: personnelCacheService.getFirstSelection() }),
      (p: Personnel) => postAction(p),
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
      () => personnelCacheService.selection.selected.length > 0));

  }

}
