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

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {UserSessionService} from 'src/app/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {Book} from '../../../shared/models/book/book';
import {BOOK_LIST_MENU, BOOK_TABLE_CACHE} from '../../providers/book-providers-factory';

@Component({
  selector: 'ms-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  constructor(@Inject(BOOK_TABLE_CACHE) public tableCache: TableCache<Book>,
              public userSession: UserSessionService,
              private breakpointObserver: BreakpointObserver,
              private menuState: MenuStateService,
              @Inject(BOOK_LIST_MENU) private menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[]) {
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.tableCache.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.tableCache.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.menuState.clear()
    this.menuCommands.forEach(command => {
      this.menuState.add(command.factory(true))
    })

    this.tableCache.loadData()
      .then(() => this.tableCache.clearSelection());
  }

  displayedColumns(): string[] {
    const displayedColumns = [];
    if (this.userSession.isSysAdmin) {
      displayedColumns.push('select');
    }
    displayedColumns.push('title', 'author');
    if (!this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      displayedColumns.push('gradeLevel', 'location');
    }
    return displayedColumns;
  }
}
