/*
 * Copyright 2022 Aion Technology LLC
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

import {School} from '../../../shared/models/school/school';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditDialogCommand} from '../../../../implementation/command/edit-dialog-command';
import {SchoolDialogComponent} from '../school-dialog/school-dialog.component';
import {DataSource} from '../../../../implementation/data/data-source';
import {DeleteDialogCommand} from '../../../../implementation/command/delete-dialog-command';
import {ConfimationDialogComponent} from '../../../shared/components/confimation-dialog/confimation-dialog.component';
import {Command} from '../../../../implementation/command/command';
import {SchoolCacheService} from '../../services/school/school-cache.service';

export const editDialogCommandFactory = (school: School, router: Router, dialog: MatDialog, snackBar: MatSnackBar):
  EditDialogCommand<School> => new EditDialogCommand<School>(
  'Edit School',
  'school',
  SchoolDialogComponent,
  'School updated',
  null,
  router,
  dialog,
  snackBar,
  () => ({model: school}),
  () => {
  },
  () => true);

export const deleteDialogCommandFactory = (school: School, dataSource: DataSource<School>, repositoryService: SchoolCacheService,
                                           router: Router, dialog: MatDialog, snackBar: MatSnackBar): DeleteDialogCommand<School> =>
  new DeleteDialogCommand(
    'Remove School',
    'school',
    ConfimationDialogComponent,
    'School(s) removed',
    'school',
    'schools',
    router,
    dialog,
    snackBar,
    '/schoolsmanager',
    () => 1,
    () => dataSource.remove(school)
      .then(repositoryService.loadData),
    () => true);

class InviteStudentCommand extends Command {
  constructor(title: string,
              group: string,
              private dialog: MatDialog,
              private componentType: any,
              private snackBar: MatSnackBar,
              private enabled: () => boolean) {
    super(title, group);
  }

  execute(): void {
    const dialogRef = this.dialog.open(this.componentType, {
      width: '500px',
      disableClose: true,
      data: {
        message: 'Hello'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.removeItem().then(item => {
      //     this.openSnackBar(this.snackBar, this.snackBarMessage, '');
      //     if (this.routeTo) {
      //       this.router.navigate([this.routeTo]);
      //     }
      //   });
      // }
    });
  }

  isEnabled(): boolean {
    return this.enabled();
  }
}

export const inviteStudentCommandFactory = (dialog: MatDialog,
                                            componentType: any,
                                            snackBar: MatSnackBar) =>
  new InviteStudentCommand('Invite Student',
    'school',
    dialog,
    componentType,
    snackBar,
    () => true);
