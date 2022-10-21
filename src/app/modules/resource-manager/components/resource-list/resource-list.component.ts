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
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserSessionService} from 'src/app/implementation/services/user-session.service';
import {BOOK_GROUP, GAME_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP} from '../../resource-manager.module';

@Component({
  selector: 'ms-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit, AfterViewInit, OnDestroy {

  tabGroupIndex: number;
  private fragmentSubscription$: Subscription;

  constructor(public userSession: UserSessionService,
              private menuState: MenuStateService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.menuState.clear()
    this.fragmentSubscription$ = this.route.fragment.subscribe(fragment => {
      if (fragment === 'books') {
        this.tabGroupIndex = 0;
      } else if (fragment === 'games') {
        this.tabGroupIndex = 1;
      }
    });
  }

  ngAfterViewInit(): void {
    this.onIndexChange(0);
  }

  ngOnDestroy(): void {
    this.menuState.clear();
    this.fragmentSubscription$.unsubscribe();
  }

  onIndexChange(index: number): void {
    this.menuState.makeAllVisible();
    if(this.userSession.isProgAdmin) {
      switch (index) {
        case 0:
          this.menuState.makeGroupInvisible(BOOK_GROUP);
          this.menuState.makeGroupInvisible(GAME_GROUP);
          this.menuState.makeGroupInvisible(SCHOOL_GAME_GROUP);
          break;
        case 1:
          this.menuState.makeGroupInvisible(BOOK_GROUP);
          this.menuState.makeGroupInvisible(GAME_GROUP);
          this.menuState.makeGroupInvisible(SCHOOL_BOOK_GROUP);
          break;
        case 2:
          this.menuState.makeGroupInvisible(GAME_GROUP);
          this.menuState.makeGroupInvisible(SCHOOL_BOOK_GROUP);
          this.menuState.makeGroupInvisible(SCHOOL_GAME_GROUP);
          break;
        case 3:
          this.menuState.makeGroupInvisible(BOOK_GROUP);
          this.menuState.makeGroupInvisible(SCHOOL_BOOK_GROUP);
          this.menuState.makeGroupInvisible(SCHOOL_GAME_GROUP);
          break;
      }
    } else {
      switch (index) {
        case 0:
          this.menuState.makeGroupInvisible(GAME_GROUP);
          break;
        case 1:
          this.menuState.makeGroupInvisible(BOOK_GROUP);
          break;
      }
    }
  }

}

