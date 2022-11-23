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
import {ActivatedRoute} from '@angular/router';
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
  tabIndex: number

  constructor(
    public userSession: UserSessionService,
    private menuState: MenuStateService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.menuState.reset()
    this.menuState.groupNames = [BOOK_GROUP, GAME_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP]
    this.registerFragmentHandler()
  }

  ngAfterViewInit(): void {
    if (this.tabIndex === undefined) {
      this.onTabChange(0);
    }
  }

  ngOnDestroy(): void {
    this.menuState.reset();
  }

  onTabChange(index: number): void {
    setState(index, this.menuState, this.userSession);
  }

  private registerFragmentHandler() {
    this.route.fragment.subscribe(fragment => {
      if (this.userSession.isSysAdmin) {
        switch (fragment) {
          case 'book':
            this.tabIndex = 0
            this.onTabChange(0)
            break
          case 'game':
            this.tabIndex = 1
            this.onTabChange(1)
            break
        }
      } else {
        switch (fragment) {
          case 'schoolbook':
            this.tabIndex = 0
            this.onTabChange(0)
            break
          case 'schoolgame':
            this.tabIndex = 1
            this.onTabChange(1)
            break
          case 'book':
            this.tabIndex = 2
            this.onTabChange(2)
            break
          case 'game':
            this.tabIndex = 3
            this.onTabChange(3)
            break
        }
      }
    })
  }

}

