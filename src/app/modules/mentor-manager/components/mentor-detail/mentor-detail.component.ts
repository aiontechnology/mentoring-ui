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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {Mentor} from '../../models/mentor/mentor';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {MentorDialogComponent} from '../mentor-dialog/mentor-dialog.component';
import {UserSessionService} from 'src/app/services/user-session.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {MentorCacheService} from '../../services/mentor/mentor-cache.service';
import {MENTOR_DATA_SOURCE, MENTOR_URI_SUPPLIER} from '../../../shared/shared.module';
import {RouteWatchingService} from '../../../../services/route-watching.service';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'ms-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.scss'],
  providers: [RouteWatchingService]
})
export class MentorDetailComponent implements OnInit, OnDestroy {

  mentor: Mentor;
  private mentorId: string;
  private schoolId: string;

  constructor(public userSession: UserSessionService,
              @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
              @Inject(MENTOR_URI_SUPPLIER) private mentorUriSupplier: UriSupplier,
              private mentorCacheService: MentorCacheService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private routeWatcher: RouteWatchingService,
              private navigation: NavigationService) {
  }

  ngOnInit(): void {
    this.routeWatcher.open(this.route)
      .pipe(
        tap(params => {
          this.schoolId = params.get('schoolId');
          this.mentorId = params.get('mentorId');
        }),
        tap(() => {
          this.navigation.routeParams =
            this.userSession.isSysAdmin
              ? ['/mentormanager', 'schools', this.schoolId]
              : ['/mentormanager'];
        })
      )
      .subscribe(params => {
          this.mentorDataSource.oneValue(this.mentorId)
            .then(mentor => {
              this.mentor = mentor;
              this.menuState.removeGroup('mentor');
              MentorDetailMenuManager.addMenus(this.mentor,
                this.menuState,
                this.router,
                this.dialog,
                this.snackBar,
                this.mentorDataSource,
                this.mentorCacheService,
                this.schoolId,
                this.navigation.routeParams.join('/'));
            });
        });
  }

  ngOnDestroy(): void {
    this.navigation.clearRoute();
    this.menuState.clear();
  }

}

class MentorDetailMenuManager {
  static addMenus(mentor: Mentor,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  mentorDataSource: DataSource<Mentor>,
                  mentorCacheService: MentorCacheService,
                  schoolId: string,
                  routeTo: string) {
    menuState.add(new EditDialogCommand(
      'Edit Mentor',
      'mentor',
      MentorDialogComponent,
      'Mentor updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({schoolId, model: mentor}),
      () => {
      },
      () => true));
    menuState.add(new DeleteDialogCommand<Mentor>(
      'Remove Mentor',
      'mentor',
      ConfimationDialogComponent,
      'Mentor(s) removed',
      'mentor',
      'mentors',
      router,
      dialog,
      snackBar,
      routeTo,
      () => 1,
      () => mentorDataSource.remove(mentor)
        .then(mentorCacheService.loadData),
      () => true));
  }

}
