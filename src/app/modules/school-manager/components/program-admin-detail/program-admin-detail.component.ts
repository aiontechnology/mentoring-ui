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

import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {NewDialogCommand} from 'src/app/implementation/command/new-dialog-command';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {ProgramAdmin} from '../../models/program-admin/program-admin';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {ProgramAdminDialogComponent} from '../program-admin-dialog/program-admin-dialog.component';
import {PROGRAM_ADMIN_DATA_SOURCE} from '../../../shared/shared.module';
import {DataSource} from '../../../../implementation/data/data-source';
import {RouteWatchingService} from '../../../../services/route-watching.service';

@Component({
  selector: 'ms-program-admin-detail',
  templateUrl: './program-admin-detail.component.html',
  styleUrls: ['./program-admin-detail.component.scss'],
  providers: [RouteWatchingService]
})
export class ProgramAdminDetailComponent implements OnInit {

  @Input() schoolId: string;
  programAdmin: ProgramAdmin;

  constructor(@Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private routeWatcher: RouteWatchingService) {
  }

  ngOnInit(): void {
    this.menuState.removeGroup('program-admin');
    ProgramAdminDetailMenuManager.addMenus(this.menuState,
      this.router,
      this.dialog,
      this.snackBar,
      this.programAdmin,
      this.programAdminDataSource,
      this.schoolId);

    this.routeWatcher.open(this.route)
      .subscribe(params => {
        this.programAdminDataSource.allValues()
          .then(admin => this.programAdmin = admin[0]);
      });
    //
    // this.programAdminDataSource.this.programAdminService.readAllProgramAdmins(this.schoolId);
    // this.subscription$ = this.programAdminService.items.subscribe(value => {
    //   this.programAdmin = value[0];
    // });
  }
}

class ProgramAdminDetailMenuManager {
  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  programAdmin: ProgramAdmin,
                  programAdminDataSource: DataSource<ProgramAdmin>,
                  schoolId: string): void {
    menuState.add(new NewDialogCommand(
      'Add Program Admin',
      'program-admin',
      ProgramAdminDialogComponent,
      'Program admin added',
      null,
      {schoolId},
      router,
      dialog,
      snackBar,
      () => {
      },
      () => programAdmin === undefined));
    menuState.add(new EditDialogCommand(
      'Edit Program Admin',
      'program-admin',
      ProgramAdminDialogComponent,
      'Program admin updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({model: programAdmin}),
      () => {
      },
      () => programAdmin !== undefined));
    menuState.add(new DeleteDialogCommand(
      'Remove Program Admin(s)',
      'program-admin',
      ConfimationDialogComponent,
      'Program admin(s) removed',
      'program admin',
      'program admins',
      router,
      dialog,
      snackBar,
      null,
      () => 1,
      () => programAdminDataSource.remove(programAdmin)
        .then(),
      () => programAdmin !== undefined));
  }

}
