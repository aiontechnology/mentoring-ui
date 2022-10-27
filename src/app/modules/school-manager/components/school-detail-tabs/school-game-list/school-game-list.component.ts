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

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../../implementation/command/command';
import {UriSupplier} from '../../../../../implementation/data/uri-supplier';
import {SCHOOL_ID} from '../../../../../implementation/route/route-constants';
import {TableCache} from '../../../../../implementation/table-cache/table-cache';
import {SCHOOL_GAME_TABLE_CACHE, SCHOOL_GAME_URI_SUPPLIER} from '../../../../../providers/global-school-game-providers-factory';
import {Game} from '../../../../../implementation/models/game/game';
import {SCHOOL_GAME_LIST_MENU} from '../../../school-manager.module';

@Component({
  selector: 'ms-school-game-list',
  templateUrl: './school-game-list.component.html',
  styleUrls: ['./school-game-list.component.scss']
})
export class SchoolGameListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(SCHOOL_GAME_TABLE_CACHE) public tableCache: TableCache<Game>,
              private menuState: MenuStateService,
              private route: ActivatedRoute,
              private breakpointObserver: BreakpointObserver,
              @Inject(SCHOOL_GAME_URI_SUPPLIER) private schoolGameUriSupplier: UriSupplier,
              @Inject(SCHOOL_GAME_LIST_MENU) private menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[]) {
  }

  ngOnInit(): void {
    this.menuCommands.forEach(command => {
      this.menuState.add(command.factory(false))
    })

    this.route.paramMap
      .subscribe(params => {
        this.schoolGameUriSupplier.withSubstitution('schoolId', params.get(SCHOOL_ID));
        this.tableCache.loadData()
          .then(() => {
            this.tableCache.clearSelection()
          });
      })
  }

  ngAfterViewInit(): void {
    this.tableCache.sort = this.sort;
    this.tableCache.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['name'];
    } else {
      return ['name', 'grade1', 'grade2', 'location'];
    }
  }
}
