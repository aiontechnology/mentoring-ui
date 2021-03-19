/**
 * Copyright 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { Mentor } from '../../models/mentor/mentor';
import { MentorRepositoryService } from '../../services/mentor/mentor-repository.service';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { MentorDialogComponent } from '../mentor-dialog/mentor-dialog.component';
import { Subscription } from 'rxjs';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'ms-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.scss']
})
export class MentorDetailComponent implements OnDestroy {

  private mentorId: string;
  private schoolId: string;
  private subscriptions$: Subscription;

  mentor: Mentor;

  constructor(route: ActivatedRoute,
              public userSession: UserSessionService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private mentorService: MentorRepositoryService,
              private snackBar: MatSnackBar,
              private router: Router) {

    this.subscriptions$ = new Subscription();

    const subscription1$ = route.paramMap.subscribe(
      params => {
        this.mentorId = params.get('mentorId');
        this.schoolId = params.get('schoolId');
      }
    );

    this.mentorService.readOneMentor(this.schoolId, this.mentorId);
    const subscription2$ = this.mentorService.mentors.subscribe(() => {

      this.menuState.removeGroup('mentor');
      this.mentor = this.mentorService.getMentorById(this.mentorId);

      console.log('Adding mentor detail menus');
      MentorDetailMenuManager.addMenus(this.mentor,
                                       this.menuState,
                                       this.router,
                                       this.dialog,
                                       this.snackBar,
                                       this.mentorService,
                                       this.schoolId);

    });

    this.subscriptions$.add(subscription1$);
    this.subscriptions$.add(subscription2$);

  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.menuState.clear();
  }

}

class MentorDetailMenuManager {

  static addMenus(mentor: Mentor,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  mentorService: MentorRepositoryService,
                  schoolId: string) {
    menuState.add(new EditDialogCommand(
      'Edit Mentor',
      'mentor',
      MentorDialogComponent,
      'Mentor updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({ schoolId, model: mentor }),
      () => { },
      () => true));
    menuState.add(new DeleteDialogCommand(
      'Remove Mentor',
      'mentor',
      ConfimationDialogComponent,
      'Mentor(s) removed',
      'mentor',
      'mentors',
      router,
      dialog,
      snackBar,
      '/mentormanager',
      () => 1,
      () => mentorService.deleteMentors([mentor]),
      () => true));
  }

}
