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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {Book} from 'src/app/modules/shared/models/book/book';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {BookDialogComponent} from '../book-dialog/book-dialog.component';
import {resourceGrades} from 'src/app/modules/shared/constants/resourceGrades';
import {UserSessionService} from 'src/app/services/user-session.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {BookCacheService} from '../../services/resources/book-cache.service';
import {DataSource} from '../../../../implementation/data/data-source';
import {BOOK_DATA_SOURCE} from '../../../shared/shared.module';

@Component({
  selector: 'ms-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit, OnDestroy {
  book: Book;
  private bookId: string;

  constructor(private route: ActivatedRoute,
              @Inject(BOOK_DATA_SOURCE) private bookDataSource: DataSource<Book>,
              private bookCacheService: BookCacheService,
              private userSession: UserSessionService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private snackBar: MatSnackBar,
              private router: Router,
              private navigation: NavigationService) {
  }

  get resourceGrades() {
    return resourceGrades;
  }

  ngOnInit(): void {
    this.setMenu();

    this.navigation.routeParams = ['resourcemanager'];
    this.navigation.fragment = 'books';

    /* Watch the book UUID. Call event handler when it changes */
    this.route.paramMap
      .subscribe(params => this.onBookIdChange(params.get('id')));
  }

  ngOnDestroy(): void {
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  /**
   * Handle book ID changes.
   * @param bookId The ID of the current book.
   */
  private onBookIdChange = (bookId: string): void => {
    if (bookId) {
      this.bookId = bookId;
      this.bookDataSource.oneValue(this.bookId)
        .then(book => {
          this.book = book;
        });
    } else {
      throw new Error('Unable to set book id');
    }
  }

  private setMenu(): void {
    this.menuState.removeGroup('book');
    if (this.userSession.isSysAdmin) {
      BookDetailMenuManager.addMenus(this,
        this.menuState,
        this.router,
        this.dialog,
        this.snackBar,
        this.bookDataSource,
        this.bookCacheService);
    }
  }

}

class BookDetailMenuManager {
  static addMenus(component: BookDetailComponent,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  bookDataSource: DataSource<Book>,
                  bookCacheService: BookCacheService) {
    menuState.add(new EditDialogCommand(
      'Edit Book',
      'book',
      BookDialogComponent,
      'Book updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({model: component.book}),
      (book: Book) => component.book = book,
      () => true));
    menuState.add(new DeleteDialogCommand<Book>(
      'Remove Book',
      'book',
      ConfimationDialogComponent,
      'Book(s) removed',
      'book',
      'books',
      router,
      dialog,
      snackBar,
      '/resourcemanager',
      () => 1,
      () => bookDataSource.remove(component.book)
        .then(() => bookCacheService.loadData()),
      () => true));
  }

}
