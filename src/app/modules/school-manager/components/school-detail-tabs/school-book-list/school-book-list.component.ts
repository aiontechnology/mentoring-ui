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
import {ListComponent} from '../../../../../implementation/component/list-component';
import {CommandArray} from '../../../../../implementation/component/menu-registering-component';
import {Book} from '../../../../../implementation/models/book/book';
import {TableCache} from '../../../../../implementation/table-cache/table-cache';
import {SCHOOL_BOOK_TABLE_CACHE} from '../../../providers/school-book-providers-factory';
import {SCHOOL_BOOK_LIST_MENU} from '../../../school-manager.module';

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
    @Inject(SCHOOL_BOOK_LIST_MENU) menuCommands: CommandArray,
    @Inject(SCHOOL_BOOK_TABLE_CACHE) tableCache: TableCache<Book>,
  ) {
    super(menuState, menuCommands, tableCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected override loadTableCache = (): void => {
    // do nothing
  }
}
