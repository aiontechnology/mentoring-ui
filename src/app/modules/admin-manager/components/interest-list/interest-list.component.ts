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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {InterestInbound} from '../../models/interest/interest-inbound';
import {InterestCacheService} from '../../services/interests/interest-cache.service';
import {editDialogCommandFactory, newDialogCommandFactory} from './command-factories';

@Component({
  selector: 'ms-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.scss']
})
export class InterestListComponent implements OnInit, OnDestroy {

  displayedColumns: string[];

  constructor(public interestCacheService: InterestCacheService,
              private menuState: MenuStateService,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

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

    const postFunc = postActionFactory(this.interestCacheService);
    this.menuState.add(newDialogCommandFactory(this.matDialog, this.snackBar, postFunc));
    this.menuState.add(editDialogCommandFactory(this.matDialog, this.snackBar, postFunc, this.interestCacheService));
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }
}

/**
 * Factory function that creates the function passed to the NewDialogCommand as a post action function.
 * @param cacheService The cache service used by the component.
 */
export const postActionFactory = (cacheService: InterestCacheService): ((interest: InterestInbound) => Promise<void>) => {
  return (i: InterestInbound) => {
    return cacheService.loadInterests()
      .then(() => {
        cacheService.clearSelection();
        cacheService.jumpToItem(i);
      })
  };
}
