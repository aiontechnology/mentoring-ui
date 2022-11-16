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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Book} from '../../implementation/models/book/book';
import {Game} from '../../implementation/models/game/game';
import {SingleItemCacheSchoolChangeHandler} from '../../implementation/state-management/single-item-cache-school-change-handler';
import {BOOK_SCHOOL_CHANGE_HANDLER} from './providers/book-providers-factory';
import {GAME_SCHOOL_CHANGE_HANDLER} from './providers/game-providers-factory';

@Component({
  selector: 'ms-resource-manager',
  templateUrl: './resource-manager.component.html',
  styleUrls: ['./resource-manager.component.scss']
})
export class ResourceManagerComponent implements OnInit, OnDestroy {
  constructor(
    private menuState: MenuStateService,
    @Inject(BOOK_SCHOOL_CHANGE_HANDLER) private bookSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<Book>,
    @Inject(GAME_SCHOOL_CHANGE_HANDLER) private gameSchoolChangeHandler: SingleItemCacheSchoolChangeHandler<Game>,
  ) {}

  ngOnInit(): void {
    this.menuState.title = 'Resource Manager'
    this.bookSchoolChangeHandler.start()
    this.gameSchoolChangeHandler.start()
  }

  ngOnDestroy(): void {
    this.gameSchoolChangeHandler.stop()
    this.bookSchoolChangeHandler.stop()
  }
}
