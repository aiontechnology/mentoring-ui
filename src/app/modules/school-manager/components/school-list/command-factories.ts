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
import {DeleteDialogCommandOld} from '../../../../implementation/command/delete-dialog-command-old';
import {EditDialogCommandOld} from '../../../../implementation/command/edit-dialog-command-old';
import {NewDialogCommandOld} from '../../../../implementation/command/new-dialog-command-old';
import {ConfimationDialogComponent} from '../../../shared/components/confimation-dialog/confimation-dialog.component';
import {School} from '../../../shared/models/school/school';
import {SchoolCacheService} from '../../../shared/services/school/school-cache.service';
import {SchoolDialogComponent} from '../school-dialog/school-dialog.component';

type SchoolPostActionFunc = (s: School) => void;

export const newDialogCommandFactory = (router: Router, dialog: MatDialog, snackBar: MatSnackBar,
                                        postAction: SchoolPostActionFunc): NewDialogCommandOld<School, SchoolDialogComponent> =>
  new NewDialogCommandOld<School, SchoolDialogComponent>(
    'Add School',
    'school',
    SchoolDialogComponent,
    'School added',
    ['/', 'schoolsmanager', 'schools'],
    undefined,
    router,
    dialog,
    snackBar,
    postAction,
    () => true)

export const editDialogCommandFactory = (router: Router, dialog: MatDialog, snackBar: MatSnackBar, postAction: SchoolPostActionFunc,
                                         schoolCacheService: SchoolCacheService): EditDialogCommandOld<School> =>
  new EditDialogCommandOld<School>(
    'Edit School',
    'school',
    SchoolDialogComponent,
    'School updated',
    ['/', 'schoolsmanager', 'schools'],
    router,
    dialog,
    snackBar,
    () => ({model: schoolCacheService.getFirstSelection()}),
    postAction,
    () => schoolCacheService.selection.selected.length === 1)

export const deleteDialogCommandFactory = (router: Router, dialog: MatDialog, snackBar: MatSnackBar, postAction: SchoolPostActionFunc,
                                           schoolCacheService: SchoolCacheService): DeleteDialogCommandOld<School> =>
  new DeleteDialogCommandOld<School>(
    'Remove School(s)',
    'school',
    ConfimationDialogComponent,
    'School(s) removed',
    'school',
    'schools',
    router,
    dialog,
    snackBar,
    null,
    () => schoolCacheService.selectionCount,
    () => schoolCacheService.removeSelected(),
    () => schoolCacheService.selection.selected.length > 0,
    postAction)
