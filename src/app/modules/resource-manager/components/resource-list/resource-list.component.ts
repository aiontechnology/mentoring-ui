/**
 * Copyright 2020 - 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'ms-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit, AfterViewInit, OnDestroy {

  private fragmentSubscription$: Subscription;

  tabGroupIndex: number;

  constructor(public userSession: UserSessionService,
              private menuState: MenuStateService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
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
    console.log('Tab change', index, this.menuState.activeMenus);
    this.menuState.makeAllVisible();
    switch (index) {
      case 0:
        this.menuState.makeGroupInvisible('game');
        this.menuState.makeGroupInvisible('school-game');
        break;
     case 1:
      this.menuState.makeGroupInvisible('book');
      this.menuState.makeGroupInvisible('school-book');
        break;
      case 2:
      case 3:
        this.menuState.makeGroupInvisible('school-book');
        this.menuState.makeGroupInvisible('school-game');
        break;
    }
  }

}

