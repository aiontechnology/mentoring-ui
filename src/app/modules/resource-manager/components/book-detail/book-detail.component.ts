/**
 * Copyright 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { Book } from 'src/app/modules/shared/models/book/book';
import { BookRepositoryService } from 'src/app/modules/shared/services/resources/book-repository.service';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { Subscription } from 'rxjs';
import { resourceGrades } from 'src/app/modules/shared/constants/resourceGrades';
import { Grade } from 'src/app/modules/shared/types/grade';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'ms-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnDestroy {

  private subscriptions$: Subscription;
  private bookId: string;

  book: Book;
  resourceGrades: Grade[];

  constructor(route: ActivatedRoute,
              private userSession: UserSessionService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private bookService: BookRepositoryService,
              private snackBar: MatSnackBar,
              private router: Router) {

    this.subscriptions$ = new Subscription();
    this.resourceGrades = resourceGrades;

    const subscription1$ = route.paramMap.subscribe(
      params => {
        this.bookId = params.get('id');
      }
    );

    this.bookService.readOneBook(this.bookId);
    const subscription2$ = this.bookService.books.subscribe(() => {

      this.menuState.removeGroup('book');

      this.book = this.bookService.getBookById(this.bookId);

      if (this.userSession.isSysAdmin) {
        console.log('Adding book detail menus');
        BookDetailMenuManager.addMenus(this.book,
                                       this.menuState,
                                       this.router,
                                       this.dialog,
                                       this.snackBar,
                                       this.bookService);
      }

    });

    this.subscriptions$.add(subscription1$);
    this.subscriptions$.add(subscription2$);

  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.menuState.clear();
  }

}

class BookDetailMenuManager {

  static addMenus(book: Book,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  bookService: BookRepositoryService) {
    menuState.add(new EditDialogCommand(
      'Edit Book',
      'book',
      BookDialogComponent,
      'Book updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({ model: book }),
      () => { },
      () => true));
    menuState.add(new DeleteDialogCommand(
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
      () => bookService.deleteBooks([book]),
      () => true));
  }

}
