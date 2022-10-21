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
import {resourceGrades} from 'src/app/implementation/constants/resourceGrades';
import {Book} from 'src/app/implementation/models/book/book';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {AbstractDetailComponent} from '../../../../implementation/component/abstract-detail-component';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {BOOK_ID} from '../../../../implementation/route/route-constants';
import {BOOK_DETAIL_MENU, BOOK_SINGLE_CACHE} from '../../providers/book-providers-factory';

@Component({
  selector: 'ms-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent extends AbstractDetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(BOOK_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    // other
    @Inject(BOOK_SINGLE_CACHE) public bookCache: SingleItemCache<Book>,
  ) {
    super(menuState, menuCommands, route)
    menuState.clear()
  }

  get resourceGrades() {
    return resourceGrades;
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleRoute(route: ActivatedRoute) {
    route.paramMap
      .subscribe(params => {
        this.bookCache.fromId(params.get(BOOK_ID));
      })
  }

  protected registerMenus(menuState: MenuStateService, menuCommands: { name: string; factory: (isAdminOnly: boolean) => Command }[]) {
    menuCommands.forEach(command => {
      menuState.add(command.factory(false))
    })
  }
}
