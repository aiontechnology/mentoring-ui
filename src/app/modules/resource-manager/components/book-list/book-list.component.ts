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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {UserSessionService} from 'src/app/implementation/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {CommandArray} from '../../../../implementation/component/abstract-component';
import {AbstractListComponent} from '../../../../implementation/component/abstract-list-component';
import {Book} from '../../../../implementation/models/book/book';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {BOOK_LIST_MENU, BOOK_TABLE_CACHE} from '../../providers/book-providers-factory';

@Component({
  selector: 'ms-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent extends AbstractListComponent<Book> implements OnInit, OnDestroy {
  columns = ['title', 'author', 'gradeLevel', 'location']

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(BOOK_LIST_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    @Inject(BOOK_TABLE_CACHE) tableCache: TableCache<Book>,
    // other
    public userSession: UserSessionService,
  ) {
    super(menuState, menuCommands, tableCache)
    if (userSession.isSysAdmin) {
      this.columns = ['select'].concat(this.columns)
    }
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.init()
      .then(() => console.log('Initialization complete', this))
  }

  ngOnDestroy(): void {
    this.destroy()
      .then(() => console.log('Destruction complete', this))
  }

  protected override registerMenus(menuState: MenuStateService, menuCommands: CommandArray) {
    menuCommands.forEach(command => {
      menuState.add(command.factory(true))
    })
  }
}
