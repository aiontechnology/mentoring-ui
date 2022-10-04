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

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {DeleteDialogCommand} from '../../../../implementation/command/delete-dialog-command';
import {EditDialogCommand} from '../../../../implementation/command/edit-dialog-command';
import {NewDialogCommand} from '../../../../implementation/command/new-dialog-command';
import {DataSource} from '../../../../implementation/data/data-source';
import {ConfimationDialogComponent} from '../../../shared/components/confimation-dialog/confimation-dialog.component';
import {ProgramAdmin} from '../../models/program-admin/program-admin';
import {ProgramAdminDialogComponent} from '../program-admin-dialog/program-admin-dialog.component';

export const deleteDialogCommandFactory = (router: Router, dialog: MatDialog, snackBar: MatSnackBar, programAdmin: ProgramAdmin,
                                           programAdminDataSource: DataSource<ProgramAdmin>) =>
  new DeleteDialogCommand(
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
    () => programAdmin !== undefined)

export const editDialogCommandFactory = (router: Router, dialog: MatDialog, snackBar: MatSnackBar,
                                         programAdmin: ProgramAdmin): EditDialogCommand<ProgramAdmin> =>
  new EditDialogCommand<ProgramAdmin>(
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
    () => programAdmin !== undefined)

export const newDialogCommandFactory = (router: Router, dialog: MatDialog, snackBar: MatSnackBar, programAdmin: ProgramAdmin,
                                        programAdminDataSource: DataSource<ProgramAdmin>, schoolId: string) =>
  new NewDialogCommand(
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
    () => programAdmin === undefined)
