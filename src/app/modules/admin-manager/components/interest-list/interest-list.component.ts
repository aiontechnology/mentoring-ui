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
import {CommandArray} from '../../../../implementation/types/types';
import {ADMIN_LIST_MENU} from '../../providers/interest-list-menus';
import {InterestCacheService} from '../../services/interests/interest-cache.service';

@Component({
  selector: 'ms-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.scss']
})
export class InterestListComponent implements OnInit, OnDestroy {

  displayedColumns: string[];

  constructor(
    public interestCacheService: InterestCacheService,
    private menuState: MenuStateService,
    @Inject(ADMIN_LIST_MENU) private menuCommands: CommandArray,
  ) {}

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.interestCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.interestCacheService.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.displayedColumns = ['select', 'name'];

    this.interestCacheService.loadInterests();
    this.interestCacheService.clearSelection();

    this.menuState.reset()
    this.menuCommands.forEach(command => {
      this.menuState.add(command.factory(false))
    })
  }

  ngOnDestroy(): void {
    this.menuState.reset();
  }
}
