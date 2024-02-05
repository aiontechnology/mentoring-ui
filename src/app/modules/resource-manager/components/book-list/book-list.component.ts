/*
 * Copyright 2020-2024 Aion Technology LLC
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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {UserLoginService} from '../../../../implementation/security/user-login.service';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {Book} from '../../../../models/book/book';
import {BOOK_INSTANCE_CACHE} from '../../../../providers/global/global-book-providers-factory';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  ADD_BOOK_MENU_TITLE,
  ADD_BOOK_PANEL_TITLE,
  ADD_BOOK_SNACKBAR_MESSAGE,
  EDIT_BOOK_MENU_TITLE,
  EDIT_BOOK_PANEL_TITLE,
  EDIT_BOOK_SNACKBAR_MESSAGE,
  PLURAL_BOOK,
  REMOVE_BOOK_MENU_TITLE,
  REMOVE_BOOK_SNACKBAR_MESSAGE,
  SINGULAR_BOOK
} from '../../other/resource-constants';
import {BOOK_LIST_DELETE_DIALOG_MANAGER, BOOK_LIST_EDIT_DIALOG_MANAGER, BOOK_TABLE_CACHE} from '../../providers/book-providers-factory';
import {BOOK_GROUP} from '../../resource-manager.module';
import {BookDialogComponent} from '../book-dialog/book-dialog.component';

@Component({
  selector: 'ms-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent extends ListComponent<Book> implements OnInit, OnDestroy {
  columns = ['title', 'author', 'gradeLevel', 'location']

  constructor(
    // for super
    menuState: MenuStateService,
    navService: NavigationService,
    @Inject(BOOK_TABLE_CACHE) tableCache: TableCache<Book>,
    @Inject(BOOK_INSTANCE_CACHE) bookInstanceCache: SingleItemCache<Book>,
    // other
    @Inject(BOOK_LIST_EDIT_DIALOG_MANAGER) private bookEditDialogManager: DialogManager<BookDialogComponent>,
    @Inject(BOOK_LIST_DELETE_DIALOG_MANAGER) private bookDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
    public userLoginService: UserLoginService,
  ) {
    super(menuState, navService, tableCache, bookInstanceCache)
    if (userLoginService.isSystemAdmin) {
      this.columns = ['select'].concat(this.columns)
    }
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(ADD_BOOK_MENU_TITLE, BOOK_GROUP, this.bookEditDialogManager)
        .withDataSupplier(() => ({
          panelTitle: ADD_BOOK_PANEL_TITLE
        }))
        .withSnackbarMessage(ADD_BOOK_SNACKBAR_MESSAGE)
        .withAdminOnly(true)
        .build(),
      MenuDialogCommand
        .builder(EDIT_BOOK_MENU_TITLE, BOOK_GROUP, this.bookEditDialogManager)
        .withDataSupplier(() => ({
          model: this.tableCache.getFirstSelection(),
          panelTitle: EDIT_BOOK_PANEL_TITLE
        }))
        .withSnackbarMessage(EDIT_BOOK_SNACKBAR_MESSAGE)
        .withAdminOnly(true)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length === 1),
      MenuDialogCommand
        .builder(REMOVE_BOOK_MENU_TITLE, BOOK_GROUP, this.bookDeleteDialogManager)
        .withDataSupplier(() => ({
          singularName: SINGULAR_BOOK,
          pluralName: PLURAL_BOOK,
          nameSupplier: () => this.tableCache.selection.selected.map(selection => selection.title)
        }))
        .withSnackbarMessage(REMOVE_BOOK_SNACKBAR_MESSAGE)
        .withAdminOnly(true)
        .build()
        .enableIf(() => this.tableCache.selection.selected.length > 0)
    ]
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService) =>
    navService.push({routeSpec: ['/resourcemanager'], fragment: 'book'})
}
