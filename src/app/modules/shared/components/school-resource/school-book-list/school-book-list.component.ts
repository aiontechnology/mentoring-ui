/*
 * Copyright 2021-2022 Aion Technology LLC
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

import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material/dialog';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {NewDialogCommand} from 'src/app/implementation/command/new-dialog-command';
import {SchoolBookDialogComponent} from '../school-book-dialog/school-book-dialog.component';
import {Book} from 'src/app/modules/shared/models/book/book';
import {SchoolBookCacheService} from 'src/app/modules/shared/services/school-resource/school-book/school-book-cache.service';
import {SCHOOL_BOOK_URI_SUPPLIER} from '../../../shared.module';
import {UriSupplier} from '../../../../../implementation/data/uri-supplier';

@Component({
  selector: 'ms-school-book-list',
  templateUrl: './school-book-list.component.html',
  styleUrls: ['./school-book-list.component.scss'],
  providers: [SchoolBookCacheService]
})
export class SchoolBookListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;

  constructor(public schoolBookCacheService: SchoolBookCacheService,
              @Inject(SCHOOL_BOOK_URI_SUPPLIER) private schoolBookUriSupplier: UriSupplier,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.schoolBookCacheService.loadData();

    this.schoolBookCacheService.clearSelection();

    SchoolBookListMenuManager.addMenus(this.menuState,
      this.router,
      this.dialog,
      this.snackBar,
      this.schoolId,
      this.schoolBookCacheService,
      () => null);

  }

  ngAfterViewInit(): void {
    this.schoolBookCacheService.sort = this.sort;
    this.schoolBookCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['title', 'author'];
    } else {
      return ['title', 'author', 'gradeLevel', 'location'];
    }
  }

}

class SchoolBookListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  schoolId: string,
                  schoolBookCacheService: SchoolBookCacheService,
                  postAction: (b: Book) => void): void {
    menuState.add(new NewDialogCommand(
      'Update Books',
      'school-book',
      SchoolBookDialogComponent,
      'Books updated',
      null,
      {schoolId, schoolBooks: () => schoolBookCacheService.dataSource.data},
      router,
      dialog,
      snackBar,
      (b: Book) => postAction(b),
      () => true));
  }

}
