/**
 * Copyright 2021 Aion Technology LLC
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

import { Component, ViewChild, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { InterestCacheService } from '../../services/interests/interest-cache.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InterestDialogComponent } from '../interest-dialog/interest-dialog.component';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';

@Component({
  selector: 'ms-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.scss']
})
export class InterestListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  editedInterest: string;
  isEdit: boolean;
  displayedColumns: string[];

  constructor(public interestCacheService: InterestCacheService,
              private menuState: MenuStateService,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar) {

    this.isEdit = false;
    this.displayedColumns = ['select', 'name'];

  }

  ngOnInit(): void {
    this.interestCacheService.establishDatasource();
    this.interestCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding book list menus');
    InterestListMenuManager.addMenus(this.menuState, this.matDialog, this.snackBar, this.interestCacheService);
  }

  ngAfterViewInit(): void {
    this.interestCacheService.sort = this.sort;
    this.interestCacheService.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

}

class InterestListMenuManager {

  static addMenus(menuState: MenuStateService,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  interestCacheService: InterestCacheService) {
    console.log('Constructing MenuHandler');
    menuState.add(new NewDialogCommand(
      'Create New Interest',
      'interest',
      InterestDialogComponent,
      'Interest added',
      null,
      null,
      null,
      dialog,
      snackBar,
      () => true));
    menuState.add(new EditDialogCommand(
      'Edit Interest',
      'interest',
      InterestDialogComponent,
      'Interest updated',
      null,
      null,
      dialog,
      snackBar,
      () => ({ model: interestCacheService.getFirstSelection() }),
      () => interestCacheService.clearSelection(),
      () => interestCacheService.selection.selected.length === 1));
  }

}
