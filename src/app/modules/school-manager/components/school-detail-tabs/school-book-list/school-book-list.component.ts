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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../../implementation/command/menu-dialog-command';
import {ListComponent} from '../../../../../implementation/component/list-component';
import {Book} from '../../../../../implementation/models/book/book';
import {TableCache} from '../../../../../implementation/table-cache/table-cache';
import {UPDATE_BOOK_MENU_TITLE, UPDATE_BOOK_SNACKBAR_MESSAGE} from '../../../other/school-constants';
import {BOOK_UPDATE_DIALOG_MANAGER, SCHOOL_BOOK_TABLE_CACHE} from '../../../providers/school-book-providers-factory';
import {SCHOOL_BOOK_GROUP} from '../../../school-manager.module';
import {SchoolBookDialogComponent} from '../school-book-dialog/school-book-dialog.component';

@Component({
  selector: 'ms-school-book-list',
  templateUrl: './school-book-list.component.html',
  styleUrls: ['./school-book-list.component.scss']
})
export class SchoolBookListComponent extends ListComponent<Book> implements OnInit, OnDestroy {
  columns = ['title', 'author', 'gradeLevel', 'location']

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(SCHOOL_BOOK_TABLE_CACHE) tableCache: TableCache<Book>,
    //other
    @Inject(BOOK_UPDATE_DIALOG_MANAGER) private bookUpdateDialogManager: DialogManager<SchoolBookDialogComponent>,
  ) {
    super(menuState, tableCache)
  }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<Book>.builder(UPDATE_BOOK_MENU_TITLE, SCHOOL_BOOK_GROUP, this.bookUpdateDialogManager)
        .withSnackbarMessage(UPDATE_BOOK_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          localItems: () => this.tableCache.tableDataSource.data
        }))
        .build()
    ];
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected override loadTableCache = async (): Promise<void> => {
    // do nothing
  }
}
