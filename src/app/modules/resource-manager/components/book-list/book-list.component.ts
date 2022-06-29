/*
 * Copyright 2020-2022 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookCacheService } from '../../services/resources/book-cache.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Book } from 'src/app/modules/shared/models/book/book';

@Component({
  selector: 'ms-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  providers: [BookCacheService]
})
export class BookListComponent implements OnInit {

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.bookCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.bookCacheService.paginator = paginator;
    }
  }

  constructor(public bookCacheService: BookCacheService,
              public userSession: UserSessionService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {

    console.log('Constructing BookListComponent', bookCacheService);

  }

  ngOnInit(): void {
    console.log('Establishing datasource');
    this.bookCacheService.establishDatasource();

    console.log('Adding book list menus');
    if (this.userSession.isSysAdmin) {
      BookListMenuManager.addMenus(this.menuState,
                                   this.router,
                                   this.dialog,
                                   this.snackBar,
                                   (b: Book) => this.jumpToNewItem(b),
                                   this.bookCacheService);
    }
  }

  displayedColumns(): string[] {
    const displayedColumns = [];
    if (this.userSession.isSysAdmin) {
      displayedColumns.push('select');
    }
    displayedColumns.push('title', 'author');
    if (!this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      displayedColumns.push('gradeLevel', 'location');
    }
    return displayedColumns;
  }

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: Book): void {
    this.bookCacheService.clearSelection();
    this.bookCacheService.jumpToItem(newItem);
  }

}

class BookListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (b: Book) => void,
                  bookCacheService: BookCacheService): void {

    console.log('Constructing MenuHandler');

    menuState.add(new NewDialogCommand(
      'Add Book',
      'book',
      BookDialogComponent,
      'Book added',
      null,
      null,
      router,
      dialog,
      snackBar,
      (b: Book) => postAction(b),
      () => true));
    menuState.add(new EditDialogCommand(
      'Edit Book',
      'book',
      BookDialogComponent,
      'Book updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({ model: bookCacheService.getFirstSelection() }),
      (b: Book) => postAction(b),
      () => bookCacheService.selection.selected.length === 1));
    menuState.add(new DeleteDialogCommand(
      'Remove Book(s)',
      'book',
      ConfimationDialogComponent,
      'Book(s) removed',
      'book',
      'books',
      router,
      dialog,
      snackBar,
      null,
      () => bookCacheService.selectionCount,
      () => bookCacheService.removeSelected(),
      () => bookCacheService.selection.selected.length > 0));

  }

}
