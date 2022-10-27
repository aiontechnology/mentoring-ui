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

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {UserSessionService} from 'src/app/implementation/services/user-session.service';
import {BOOK_GROUP, GAME_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP} from '../../resource-manager.module';
import {setState} from './menu-state-manager';

@Component({
  selector: 'ms-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public userSession: UserSessionService,
    private menuState: MenuStateService,
  ) {
  }

  ngOnInit(): void {
    this.menuState.clear()
    this.menuState.groupNames = [BOOK_GROUP, GAME_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP]
  }

  ngAfterViewInit(): void {
    this.onTabChange(0);
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

  onTabChange(index: number): void {
    setState(index, this.menuState, this.userSession);
  }

}

