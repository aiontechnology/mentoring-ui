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
import {ActivatedRoute} from '@angular/router';
import {resourceGrades} from 'src/app/modules/shared/constants/resourceGrades';
import {Book} from 'src/app/modules/shared/models/book/book';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {UserSessionService} from 'src/app/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {BOOK_DATA_SOURCE} from '../../../shared/shared.module';
import {BOOK_DETAIL_MENU, BOOK_SINGLE_CACHE} from '../../resource-manager.module';

@Component({
  selector: 'ms-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
              @Inject(BOOK_DATA_SOURCE) private bookDataSource: DataSource<Book>,
              private userSession: UserSessionService,
              private menuState: MenuStateService,
              private navigation: NavigationService,
              @Inject(BOOK_SINGLE_CACHE) private singleItemCache: SingleItemCache<Book>,
              @Inject(BOOK_DETAIL_MENU) private menuCommands: Command[]) {
  }

  get book() {
    return this.singleItemCache.item;
  }

  set book(book: Book) {
    this.singleItemCache.item = book;
  }

  get resourceGrades() {
    return resourceGrades;
  }

  ngOnInit(): void {
    if (this.userSession.isSysAdmin) {
      this.menuState
        .clear()
        .add(this.menuCommands)
    }

    this.navigation.routeParams = ['resourcemanager'];
    this.navigation.fragment = 'books';

    /* Watch the book UUID. Call event handler when it changes */
    this.route.paramMap
      .subscribe(params => this.onIdChange(params.get('id')))
  }

  ngOnDestroy(): void {
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  /**
   * Handle book ID changes.
   * @param id The ID of the current book.
   */
  private onIdChange(id: string): void {
    this.singleItemCache.fromId(id)
      .then(item => console.log('item loaded', item))
  }
}
