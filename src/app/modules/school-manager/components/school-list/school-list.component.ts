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
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {School} from '../../../shared/models/school/school';
import {SCHOOL_LIST_MENU, SCHOOL_TABLE_CACHE} from '../../school-manager.module';

@Component({
  selector: 'ms-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {

  constructor(@Inject(SCHOOL_TABLE_CACHE) public tableCache: TableCache<School>,
              private dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              @Inject(SCHOOL_LIST_MENU) private menuCommands: { name: string, factory: ((isAdminOnly: boolean) => Command) }[]) {
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.tableCache.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.tableCache.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.menuCommands.forEach(command => {
      this.menuState.add(command.factory(false));
    })

    this.tableCache.loadData()
      .then(() => this.tableCache.clearSelection());
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'city', 'state', 'district', 'phone', 'isPrivate'];
    }
  }
}
