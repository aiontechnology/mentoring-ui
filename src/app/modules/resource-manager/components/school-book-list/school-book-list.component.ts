/*
 * Copyright 2021-2024 Aion Technology LLC
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
import {ActivatedRoute} from '@angular/router';
import {DialogManager} from '@implementation/command/dialog-manager';
import {MenuDialogCommand} from '@implementation/command/menu-dialog-command';
import {ListComponent} from '@implementation/component/list-component';
import {NavigationService} from '@implementation/route/navigation.service';
import {MenuStateService} from '@implementation/services/menu-state.service';
import {TableCache} from '@implementation/table-cache/table-cache';
import {Book} from '@models/book/book';
import {SchoolBookDialogComponent} from '@modules-resource-manager/components/school-book-dialog/school-book-dialog.component';
import {UPDATE_BOOK_MENU_TITLE, UPDATE_BOOK_SNACKBAR_MESSAGE} from '@modules-resource-manager/other/resource-constants';
import {BOOK_UPDATE_DIALOG_MANAGER, SCHOOL_BOOK_TABLE_CACHE} from '@modules-resource-manager/providers/school-book-providers-factory';
import {SCHOOL_BOOK_GROUP} from '@modules-resource-manager/resource-manager.module';

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
    navService: NavigationService,
    route: ActivatedRoute,
    @Inject(SCHOOL_BOOK_TABLE_CACHE) tableCache: TableCache<Book>,
    //other
    @Inject(BOOK_UPDATE_DIALOG_MANAGER) private bookUpdateDialogManager: DialogManager<SchoolBookDialogComponent>,
  ) {
    super(menuState, navService, route, tableCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(UPDATE_BOOK_MENU_TITLE, SCHOOL_BOOK_GROUP, this.bookUpdateDialogManager)
        .withSnackbarMessage(UPDATE_BOOK_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          localItems: () => this.tableCache.tableDataSource.data
        }))
        .build()
    ];
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService) =>
    navService.push({routeSpec: ['/resourcemanager'], fragment: 'schoolbook', filter: this.tableCache.filterBinding})
}
