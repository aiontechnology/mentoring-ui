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

import {InjectionToken, NgModule} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router, RouterModule, Routes} from '@angular/router';
import {Command} from '../../implementation/command/command';
import {DialogCommand} from '../../implementation/command/dialog-command';
import {DialogManager} from '../../implementation/command/dialog-manager';
import {NavigationManager} from '../../implementation/command/navigation-manager';
import {SnackbarManager} from '../../implementation/command/snackbar-manager';
import {DataSource} from '../../implementation/data/data-source';
import {ConfimationDialogComponent} from '../shared/components/confimation-dialog/confimation-dialog.component';
import {Book} from '../shared/models/book/book';
import {BOOK_DATA_SOURCE, SharedModule} from '../shared/shared.module';
import {BookDetailComponent} from './components/book-detail/book-detail.component';
import {BookDialogComponent} from './components/book-dialog/book-dialog.component';
import {BookListComponent} from './components/book-list/book-list.component';
import {GameDetailComponent} from './components/game-detail/game-detail.component';
import {GameDialogComponent} from './components/game-dialog/game-dialog.component';
import {GameListComponent} from './components/game-list/game-list.component';
import {ResourceListComponent} from './components/resource-list/resource-list.component';
import {ResourceManagerComponent} from './resource-manager.component';
import {BookCacheService} from './services/resources/book-cache.service';

const routes: Routes = [
  {
    path: '', component: ResourceManagerComponent,
    children: [
      {path: '', component: ResourceListComponent},
      {path: 'books/:id', component: BookDetailComponent},
      {path: 'games/:id', component: GameDetailComponent},
    ]
  }
];

export const DETAIL_AFTER_CLOSED_DELETE = new InjectionToken<(s: string) => (a: any) => void>('detail-after-closed-delete');
export const DETAIL_AFTER_CLOSED_EDIT = new InjectionToken<(s: string) => (a: any) => void>('detail-after-closed-edit');
export const DETAIL_DIALOG_MANAGER_DELETE = new InjectionToken<DialogManager<ConfimationDialogComponent>>('detail-dialog-manager-delete');
export const DETAIL_DIALOG_MANAGER_EDIT = new InjectionToken<DialogManager<BookDialogComponent>>('detail-dialog-manager-edit');
export const DETAIL_MENU = new InjectionToken<Command[]>('detail-menu');
export const DETAIL_MENU_DELETE = new InjectionToken<DialogCommand<Book>>('detail-menu-delete');
export const DETAIL_MENU_EDIT = new InjectionToken<DialogCommand<Book>>('detail-menu-edit');

export const LIST_AFTER_CLOSED_DELETE = new InjectionToken<(s: string) => (a: any) => void>('list-after-closed-delete');
export const LIST_AFTER_CLOSED_EDIT = new InjectionToken<(s: string) => (a: any) => void>('list-after-closed-edit');
export const LIST_DIALOG_MANAGER_DELETE = new InjectionToken<DialogManager<ConfimationDialogComponent>>('list-dialog-manager-delete');
export const LIST_DIALOG_MANAGER_EDIT = new InjectionToken<DialogManager<BookDialogComponent>>('list-dialog-manager-edit');
export const LIST_MENU = new InjectionToken<Command[]>('list-menu');
export const LIST_MENU_ADD = new InjectionToken<DialogCommand<Book>>('list-menu-add');
export const LIST_MENU_EDIT = new InjectionToken<DialogCommand<Book>>('list-menu-edit');
export const LIST_MENU_DELETE = new InjectionToken<DialogCommand<Book>>('list-menu-delete');
export const LIST_POST_ACTION = new InjectionToken<DialogCommand<Book>>('list-post-action');

export const BOOK_NAVIGATION_MANAGER = new InjectionToken<NavigationManager>('book-navigation-manager');
export const SNACKBAR_MANAGER = new InjectionToken<SnackbarManager>('snackbar-manager');

@NgModule({
  declarations: [
    BookDetailComponent,
    BookDialogComponent,
    BookListComponent,
    GameDetailComponent,
    GameDialogComponent,
    GameListComponent,
    ResourceListComponent,
    ResourceManagerComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [
    {
      provide: SNACKBAR_MANAGER,
      useFactory: (snackbar: MatSnackBar) => new SnackbarManager(snackbar),
      deps: [MatSnackBar]
    },

    // ********************************************************************************
    // Books **************************************************************************
    // ********************************************************************************

    // Navigation
    {
      provide: BOOK_NAVIGATION_MANAGER,
      useFactory: (router: Router) => new NavigationManager(router, ['/', 'resourcemanager', 'books']),
      deps: [Router]
    },

    // Detail delete manager
    {
      provide: DETAIL_DIALOG_MANAGER_DELETE,
      useFactory: (dialog: MatDialog, afterCloseFunction: (Component: BookDetailComponent) => (s: string) => (a: any) => void) =>
        (component: BookDetailComponent) => DialogManager<ConfimationDialogComponent>.builder(dialog, ConfimationDialogComponent)
          .withAfterCloseFunction(afterCloseFunction(component))
          .build(),
      deps: [MatDialog, DETAIL_AFTER_CLOSED_DELETE]
    },
    {
      provide: DETAIL_AFTER_CLOSED_DELETE,
      useFactory: (bookDataSource: DataSource<Book>, bookCacheService: BookCacheService, snackbarManager: SnackbarManager, router: Router) =>
        (component: BookDetailComponent) => (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
            bookDataSource.remove(component.book)
              .then(() => bookCacheService.loadData())
              .then(() => bookCacheService.clearSelection())
              .then(() => router.navigate(['/resourcemanager']))
          }
        },
      deps: [BOOK_DATA_SOURCE, BookCacheService, SNACKBAR_MANAGER, Router]
    },

    // Detail edit dialog manager
    {
      provide: DETAIL_DIALOG_MANAGER_EDIT,
      useFactory: (dialog: MatDialog, afterCloseFunction: (Component: BookDetailComponent) => (s: string) => (a: any) => void) =>
        (component: BookDetailComponent) => DialogManager<BookDialogComponent>.builder(dialog, BookDialogComponent)
          .withAfterCloseFunction(afterCloseFunction(component))
          .build(),
      deps: [MatDialog, DETAIL_AFTER_CLOSED_EDIT]
    },
    {
      provide: DETAIL_AFTER_CLOSED_EDIT,
      useFactory: (bookCacheService: BookCacheService, snackbarManager: SnackbarManager) =>
        (component: BookDetailComponent) => (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
            component.book = result;
          }
        },
      deps: [BookCacheService, SNACKBAR_MANAGER]
    },

    // Menu definitions for book detail
    {
      provide: DETAIL_MENU_DELETE,
      useFactory: (bookCacheService: BookCacheService, dialogManager: (component: BookDetailComponent) => DialogManager<ConfimationDialogComponent>) =>
        (component: BookDetailComponent) => DialogCommand<Book>
          .builder('Remove Book', 'book', dialogManager(component), () => true)
          .withSnackbarMessage('Book removed')
          .withDataSupplier(() => ({
            model: component.book,
            singularName: 'book',
            pluralName: 'books',
            countSupplier: () => 1
          }))
          .build(),
      deps: [BookCacheService, DETAIL_DIALOG_MANAGER_DELETE]
    },
    {
      provide: DETAIL_MENU_EDIT,
      useFactory: (dialogManager: (component: BookDetailComponent) => DialogManager<BookDialogComponent>) =>
        (component: BookDetailComponent) => DialogCommand<Book>
          .builder('Edit Book', 'book', dialogManager(component), () => true)
          .withSnackbarMessage('Book edited')
          .withDataSupplier(() => ({model: component.book}))
          .build(),
      deps: [DETAIL_DIALOG_MANAGER_EDIT]
    },
    {
      provide: DETAIL_MENU,
      useFactory: (deleteCommand: (component: BookDetailComponent) => Command, editCommand: (component: BookDetailComponent) => Command) =>
        [editCommand, deleteCommand],
      deps: [DETAIL_MENU_DELETE, DETAIL_MENU_EDIT]
    },

    // List delete dialog manager
    {
      provide: LIST_DIALOG_MANAGER_DELETE,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<ConfimationDialogComponent>.builder(dialog, ConfimationDialogComponent)
          .withAfterCloseFunction(afterCloseFunction)
          .withConfig({width: '500px', disableClose: true})
          .build(),
      deps: [MatDialog, LIST_AFTER_CLOSED_DELETE]
    },
    {
      provide: LIST_AFTER_CLOSED_DELETE,
      useFactory: (bookCacheService: BookCacheService, snackbarManager: SnackbarManager) =>
        (snackbarMessage: string) => result => {
          if (result) {
            bookCacheService.removeSelectedOld()
              .then(books => {
                snackbarManager.open(snackbarMessage)
              })
          }
        },
      deps: [BookCacheService, SNACKBAR_MANAGER]
    },

    // List edit dialog manager
    {
      provide: LIST_DIALOG_MANAGER_EDIT,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<BookDialogComponent>.builder(dialog, BookDialogComponent)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, LIST_AFTER_CLOSED_EDIT]
    },
    {
      provide: LIST_AFTER_CLOSED_EDIT,
      useFactory: (bookCacheService: BookCacheService, navigationManager: NavigationManager, snackbarManager: SnackbarManager,
                   listPostAction: (book: Book) => Promise<void>) =>
        (snackbarMessage: string) => result => {
          if (result) {
            if (navigationManager) {
              snackbarManager.open(snackbarMessage, 'Navigate').onAction()
                .subscribe(() => navigationManager.navigate(result.id))
            } else {
              snackbarManager.open(snackbarMessage)
            }
            listPostAction(result)
          }
        },
      deps: [BookCacheService, BOOK_NAVIGATION_MANAGER, SNACKBAR_MANAGER, LIST_POST_ACTION]
    },

    // Menu definitions for book list
    {
      provide: LIST_MENU_ADD,
      useFactory: (dialogManager: DialogManager<BookDialogComponent>) => DialogCommand<Book>
        .builder('Add Book', 'book', dialogManager, () => true)
        .withSnackbarMessage('Book added')
        .build(),
      deps: [LIST_DIALOG_MANAGER_EDIT]
    },
    {
      provide: LIST_MENU_EDIT,
      useFactory: (bookCacheService: BookCacheService, dialogManager: DialogManager<BookDialogComponent>) => DialogCommand<Book>
        .builder('Edit Book', 'book', dialogManager, () => bookCacheService.selection.selected.length === 1)
        .withDataSupplier(() => ({model: bookCacheService.getFirstSelection()}))
        .withSnackbarMessage('Book edited')
        .build(),
      deps: [BookCacheService, LIST_DIALOG_MANAGER_EDIT]
    },
    {
      provide: LIST_MENU_DELETE,
      useFactory: (bookCacheService: BookCacheService, dialogManager: DialogManager<ConfimationDialogComponent>) => DialogCommand<Book>
        .builder('Remove Book(s)', 'book', dialogManager, () => bookCacheService.selection.selected.length > 0)
        .withDataSupplier(() => {
          return {
            singularName: 'book',
            pluralName: 'books',
            countSupplier: () => bookCacheService.selectionCount
          }
        })
        .withSnackbarMessage('Book(s) removed')
        .build(),
      deps: [BookCacheService, LIST_DIALOG_MANAGER_DELETE]
    },
    {
      provide: LIST_MENU,
      useFactory: (addCommand: Command, deleteCommand: Command, editCommand: Command) => [addCommand, editCommand, deleteCommand],
      deps: [LIST_MENU_ADD, LIST_MENU_DELETE, LIST_MENU_EDIT]
    },
    {
      provide: LIST_POST_ACTION,
      useFactory: (bookCacheService: BookCacheService) =>
        (book) => bookCacheService.loadData()
          .then(() => {
            bookCacheService.clearSelection();
            if (book) {
              bookCacheService.jumpToItem(book);
            }
          }),
      deps: [BookCacheService]
    },
  ]
})
export class ResourceManagerModule {
}
