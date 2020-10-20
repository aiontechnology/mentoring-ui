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

import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'ms-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              public bookCacheService: BookCacheService) {
    console.log('Constructing BookListComponent', bookCacheService);
  }

  ngOnInit(): void {
    console.log('Establishing datasource');
    this.bookCacheService.establishDatasource();
    this.bookCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding book list menus');
    BookListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.bookCacheService);
  }

  ngAfterViewInit(): void {
    this.bookCacheService.sort = this.sort;
    this.bookCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'title', 'author'];
    } else {
      return ['select', 'title', 'author', 'gradeLevel', 'location'];
    }
  }

}

class BookListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  bookCacheService: BookCacheService) {
    console.log('Constructing MenuHandler');
    menuState.add(new NewDialogCommand(
      'Create New Book',
      'book',
      BookDialogComponent,
      'Book added',
      null,
      null,
      router,
      dialog,
      snackBar,
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
      () => bookCacheService.getFirstSelection(),
      () => bookCacheService.clearSelection(),
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
      () => { },
      () => bookCacheService.selection.selected.length > 0));
    }

}
