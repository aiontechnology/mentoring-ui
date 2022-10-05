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

import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material/dialog';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {NewDialogCommandOld} from 'src/app/implementation/command/new-dialog-command-old';
import {SchoolGameDialogComponent} from '../school-game-dialog/school-game-dialog.component';
import {Game} from 'src/app/modules/shared/models/game/game';
import {SchoolGameCacheService} from 'src/app/modules/shared/services/school-resource/school-game/school-game-cache.service';
import {SCHOOL_GAME_URI_SUPPLIER} from '../../../shared.module';
import {UriSupplier} from '../../../../../implementation/data/uri-supplier';

@Component({
  selector: 'ms-school-game-list',
  templateUrl: './school-game-list.component.html',
  styleUrls: ['./school-game-list.component.scss'],
  providers: [SchoolGameCacheService]
})
export class SchoolGameListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;

  constructor(public schoolGameCacheService: SchoolGameCacheService,
              @Inject(SCHOOL_GAME_URI_SUPPLIER) private schoolGameUriSupplier: UriSupplier,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.schoolGameUriSupplier.withSubstitution('schoolId', this.schoolId);
    this.schoolGameCacheService.loadData();

    this.schoolGameCacheService.clearSelection();

    SchoolGameListMenuManager.addMenus(this.menuState,
      this.router,
      this.dialog,
      this.snackBar,
      this.schoolId,
      this.schoolGameCacheService,
      () => null);
  }

  ngAfterViewInit(): void {
    this.schoolGameCacheService.sort = this.sort;
    this.schoolGameCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['name'];
    } else {
      return ['name', 'grade1', 'grade2', 'location'];
    }
  }

}

class SchoolGameListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  schoolId: string,
                  schoolGameCacheService: SchoolGameCacheService,
                  postAction: (g: Game) => void): void {
    menuState.add(new NewDialogCommandOld(
      'Update Games',
      'school-game',
      SchoolGameDialogComponent,
      'Games updated',
      null,
      {schoolId, schoolGames: () => schoolGameCacheService.dataSource.data},
      router,
      dialog,
      snackBar,
      (g: Game) => postAction(g),
      () => true));
  }

}
