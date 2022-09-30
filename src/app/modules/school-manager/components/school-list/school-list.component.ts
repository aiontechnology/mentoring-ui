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

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {School} from 'src/app/modules/shared/models/school/school';
import {SchoolCacheService} from 'src/app/modules/shared/services/school/school-cache.service';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {deleteDialogCommandFactory, editDialogCommandFactory, newDialogCommandFactory} from './command-factories';

@Component({
  selector: 'ms-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit, OnDestroy {

  constructor(public schoolCacheService: SchoolCacheService,
              private dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.schoolCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.schoolCacheService.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.schoolCacheService.loadSchools()
      .then(() => this.schoolCacheService.clearSelection());

    const postFunc = postActionFactory(this.schoolCacheService);
    this.menuState.add(newDialogCommandFactory(this.router, this.dialog, this.snackBar, postFunc));
    this.menuState.add(editDialogCommandFactory(this.router, this.dialog, this.snackBar, postFunc, this.schoolCacheService));
    this.menuState.add(deleteDialogCommandFactory(this.router, this.dialog, this.snackBar, postFunc, this.schoolCacheService));
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'city', 'state', 'district', 'phone', 'isPrivate'];
    }
  }

}

/**
 * Factory function that creates the function passed to Command objects as a post action function.
 * @param cacheService The cache service used by the component.
 */
export const postActionFactory = (cacheService: SchoolCacheService): (school?: School) => Promise<void> =>
  school => cacheService.loadSchools()
    .then(() => {
      cacheService.clearSelection();
      if (school) {
        cacheService.jumpToItem(school);
      }
    });
