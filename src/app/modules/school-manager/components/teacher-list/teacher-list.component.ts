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
import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {NewDialogCommand} from 'src/app/implementation/command/new-dialog-command';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {TeacherCacheService} from '../../services/teacher/teacher-cache.service';
import {TeacherDialogComponent} from '../teacher-dialog/teacher-dialog.component';
import {Teacher} from '../../models/teacher/teacher';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {TEACHER_URI_SUPPLIER} from '../../../shared/shared.module';
import {RouteWatchingService} from '../../../../services/route-watching.service';

@Component({
  selector: 'ms-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
  providers: [RouteWatchingService]
})
export class TeacherListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;

  constructor(public teacherCacheService: TeacherCacheService,
              @Inject(TEACHER_URI_SUPPLIER) private teacherUriSupplier: UriSupplier,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private route: ActivatedRoute,
              private router: Router,
              private routeWatcher: RouteWatchingService,
              private snackBar: MatSnackBar,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    TeacherListMenuManager.addMenus(this.menuState,
      this.router,
      this.dialog,
      this.snackBar,
      (t: Teacher) => this.jumpToNewItem(t),
      this.teacherCacheService,
      this.schoolId);

    this.routeWatcher.open(this.route)
      .subscribe(params => {
        this.teacherCacheService.loadData()
          .then(() => {
            this.teacherCacheService.clearSelection();
          });
      });
  }

  ngAfterViewInit(): void {
    this.teacherCacheService.sort = this.sort;
    this.teacherCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'firstName', 'lastName'];
    } else {
      return ['select', 'firstName', 'lastName', 'email', 'cellPhone', 'grades'];
    }
  }

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: Teacher): void {
    this.teacherCacheService.clearSelection();
    this.teacherCacheService.jumpToItem(newItem);
  }

}

class TeacherListMenuManager {
  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (t: Teacher) => void,
                  teacherCacheService: TeacherCacheService,
                  schoolId: string): void {
    menuState.add(new NewDialogCommand(
      'Add Teacher',
      'teacher',
      TeacherDialogComponent,
      'Teacher added',
      null,
      {schoolId},
      router,
      dialog,
      snackBar,
      (t: Teacher) => postAction(t),
      () => true));
    menuState.add(new EditDialogCommand(
      'Edit Teacher',
      'teacher',
      TeacherDialogComponent,
      'Teacher updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({model: teacherCacheService.getFirstSelection()}),
      (t: Teacher) => postAction(t),
      () => teacherCacheService.selection.selected.length === 1));
    menuState.add(new DeleteDialogCommand(
      'Remove Teacher(s)',
      'teacher',
      ConfimationDialogComponent,
      'Teacher(s) removed',
      'teacher',
      'teachers',
      router,
      dialog,
      snackBar,
      null,
      () => teacherCacheService.selectionCount,
      () => teacherCacheService.removeSelected(),
      () => teacherCacheService.selection.selected.length > 0));
  }

}
