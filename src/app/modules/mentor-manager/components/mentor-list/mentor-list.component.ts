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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UserSessionService } from 'src/app/services/user-session.service';
import { SchoolRepositoryService } from 'src/app/modules/shared/services/school/school-repository.service';
import { School } from 'src/app/modules/shared/models/school/school';
import { MentorCacheService } from '../../services/mentor/mentor-cache.service';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { MentorDialogComponent } from '../mentor-dialog/mentor-dialog.component';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Mentor } from '../../models/mentor/mentor';

@Component({
  selector: 'ms-mentor-list',
  templateUrl: './mentor-list.component.html',
  styleUrls: ['./mentor-list.component.scss'],
  providers: [MentorCacheService]
})
export class MentorListComponent implements OnInit, OnDestroy {

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

  schools$: Observable<School[]>;
  schoolId: string;

  constructor(public userSession: UserSessionService,
              public mentorCacheService: MentorCacheService,
              private schoolRepository: SchoolRepositoryService,
              private logger: LoggingService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {
    console.log('mentor list constructed');
  }

  ngOnInit(): void {
    if (this.userSession.isSysAdmin) {
      this.schoolRepository.readAllSchools();
      this.schools$ = this.schoolRepository.schools.pipe(
        tap(s => this.logger.log('Read schools', s))
      );
    } else if (this.userSession.isProgAdmin) {
      this.schoolId = this.userSession.schoolUUID;
      this.loadMentorData();
    }
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

  get isSchoolSelected(): boolean {
    return (this.schoolId !== undefined) || this.userSession.isProgAdmin;
  }

  setSchool(id$: string) {
    this.schoolId = id$;
    this.loadMentorData();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'lastName', 'availability', 'cellPhone'];
    } else {
      return ['select', 'firstName', 'lastName', 'availability', 'cellPhone', 'email'];
    }
  }

  private loadMentorData(): void {

    this.mentorCacheService.establishDatasource(this.schoolId);

    console.log('Adding mentor list menus');
    MentorListMenuManager.addMenus(this.menuState,
                                   this.router,
                                   this.dialog,
                                   this.snackBar,
                                   (m: Mentor) => this.jumpToNewItem(m),
                                   this.mentorCacheService,
                                   this.schoolId);

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

    console.log('Constructing MenuHandler');
    menuState.clear();

    menuState.add(new NewDialogCommand(
      'Create New Mentor',
      'mentor',
      MentorDialogComponent,
      'Mentor added',
      null,
      { schoolId },
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
      () => ({ schoolId, model: mentorCacheService.getFirstSelection() }),
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
