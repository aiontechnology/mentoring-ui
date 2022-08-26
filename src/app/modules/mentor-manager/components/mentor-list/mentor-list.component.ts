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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserSessionService} from 'src/app/services/user-session.service';
import {School} from 'src/app/modules/shared/models/school/school';
import {MentorCacheService} from '../../services/mentor/mentor-cache.service';
import {NewDialogCommand} from 'src/app/implementation/command/new-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {MentorDialogComponent} from '../mentor-dialog/mentor-dialog.component';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Mentor} from '../../models/mentor/mentor';
import {SCHOOL_DATA_SOURCE} from '../../../shared/shared.module';
import {RouteWatchingService} from '../../../../services/route-watching.service';
import {DataSource} from '../../../../implementation/data/data-source';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'ms-mentor-list',
  templateUrl: './mentor-list.component.html',
  styleUrls: ['./mentor-list.component.scss'],
  providers: [RouteWatchingService]
})
export class MentorListComponent implements OnInit, OnDestroy {

  schools$: Promise<School[]>;
  selectedSchool: School;

  constructor(public userSession: UserSessionService,
              public mentorCacheService: MentorCacheService,
              @Inject(SCHOOL_DATA_SOURCE) private schoolDataSource: DataSource<School>,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private routeWatcher: RouteWatchingService) {
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.mentorCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.mentorCacheService.paginator = paginator;
    }
  }

  get isSchoolSelected(): boolean {
    return (this.routeWatcher.schoolId != null) || this.userSession.isProgAdmin;
  }

  ngOnInit(): void {
    this.routeWatcher.open(this.route)
      .pipe(
        tap(() => this.schools$ = this.schoolDataSource.allValues()),
      )
      .subscribe(() => {
        this.routeWatcher.school
          .then(school => {
            if (school) {
              this.selectedSchool = school;
              this.loadMentorData();
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.routeWatcher.close();
    this.menuState.clear();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'lastName', 'availability', 'cellPhone'];
    } else {
      return ['select', 'firstName', 'lastName', 'availability', 'cellPhone', 'email', 'mediaReleaseSigned', 'backgroundCheckCompleted'];
    }
  }

  isLoading(gettingData: boolean): boolean {
    return gettingData && this.isSchoolSelected;
  }

  private loadMentorData(): void {
    this.mentorCacheService.loadData()
      .then(() => {
        MentorListMenuManager.addMenus(this.menuState,
          this.router,
          this.dialog,
          this.snackBar,
          (m: Mentor) => this.jumpToNewItem(m),
          this.mentorCacheService,
          this.routeWatcher.schoolId);
      });
  }

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: Mentor): void {
    this.mentorCacheService.clearSelection();
    this.mentorCacheService.jumpToItem(newItem);
  }

}

class MentorListMenuManager {
  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (m: Mentor) => void,
                  mentorCacheService: MentorCacheService,
                  schoolId: string): void {
    menuState.clear();

    menuState.add(new NewDialogCommand(
      'Add Mentor',
      'mentor',
      MentorDialogComponent,
      'Mentor added',
      null,
      {schoolId},
      router,
      dialog,
      snackBar,
      (m: Mentor) => postAction(m),
      () => schoolId != null));
    menuState.add(new EditDialogCommand(
      'Edit Mentor',
      'mentor',
      MentorDialogComponent,
      'Mentor updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({schoolId, model: mentorCacheService.getFirstSelection()}),
      (m: Mentor) => postAction(m),
      () => mentorCacheService.selection.selected.length === 1));
    menuState.add(new DeleteDialogCommand(
      'Delete Mentor',
      'mentor',
      ConfimationDialogComponent,
      'Mentor(s) removed',
      'mentor',
      'mentors',
      router,
      dialog,
      snackBar,
      null,
      () => mentorCacheService.selectionCount,
      () => mentorCacheService.removeSelected(),
      () => mentorCacheService.selection.selected.length > 0));
  }

}
