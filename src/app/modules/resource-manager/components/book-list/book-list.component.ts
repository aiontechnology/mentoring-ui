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
import { NewBookDialogCommand } from '../../implementation/resource-menu-commands';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
    console.log('Adding book list menus')
    BookListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar);
  }

  ngAfterViewInit(): void {
    this.bookCacheService.sort = this.sort;
    this.bookCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'title', 'author'];
    } else {
      return ['select', 'title', 'author', 'gradeLevel'];
    }
  }

}

class BookListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar) {
    console.log('Constructing MenuHandler');
    menuState.add(new NewBookDialogCommand('Create New Book', router, dialog, snackBar));
  }

}
