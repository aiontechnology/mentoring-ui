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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { InterestCacheService } from '../../services/interests/interest-cache.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InterestDialogComponent } from '../interest-dialog/interest-dialog.component';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { InterestInbound } from '../../models/interest/interest-inbound';

@Component({
  selector: 'ms-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.scss'],
  providers: [InterestCacheService]
})
export class InterestListComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.interestCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.interestCacheService.paginator = paginator;
    }
  }

  displayedColumns: string[];

  editedInterest: string;
  isEdit: boolean;

  constructor(public interestCacheService: InterestCacheService,
              private menuState: MenuStateService,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar) {

    this.displayedColumns = ['select', 'name'];
    this.isEdit = false;

  }

  ngOnInit(): void {
    this.interestCacheService.establishDatasource();
    this.interestCacheService.clearSelection();

    console.log('Adding interest list menus');
    InterestListMenuManager.addMenus(this.menuState,
                                     this.matDialog,
                                     this.snackBar,
                                     (i: InterestInbound) => this.jumpToNewItem(i),
                                     this.interestCacheService);
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

  /**
   * Action taken after a dialog is closed: Move
   * to page that displays the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: InterestInbound): void {
    this.interestCacheService.clearSelection();
    this.interestCacheService.jumpToItem(newItem);
  }

}

class InterestListMenuManager {

  static addMenus(menuState: MenuStateService,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (i: InterestInbound) => void,
                  interestCacheService: InterestCacheService): void {

    console.log('Constructing MenuHandler');

    menuState.add(new NewDialogCommand(
      'Add Interest',
      'interest',
      InterestDialogComponent,
      'Interest added',
      null,
      null,
      null,
      dialog,
      snackBar,
      (i: InterestInbound) => postAction(i),
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
      (i: InterestInbound) => postAction(i),
      () => interestCacheService.selection.selected.length === 1));

  }

}
