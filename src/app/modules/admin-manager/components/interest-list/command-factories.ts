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
import {InterestInbound} from '../../models/interest/interest-inbound';
import {InterestCacheService} from '../../services/interests/interest-cache.service';
import {NewDialogCommandOld} from '../../../../implementation/command/new-dialog-command-old';
import {InterestDialogComponent} from '../interest-dialog/interest-dialog.component';
import {EditDialogCommandOld} from '../../../../implementation/command/edit-dialog-command-old';

export const newDialogCommandFactory = (dialog: MatDialog, snackBar: MatSnackBar, postAction: (i: InterestInbound) => void):
  NewDialogCommandOld<InterestInbound, InterestDialogComponent> =>
  new NewDialogCommandOld<InterestInbound, InterestDialogComponent>(
    'Add Interest',
    'interest',
    InterestDialogComponent,
    'Interest added',
    null,
    null,
    null,
    dialog,
    snackBar,
    (i: InterestInbound) => postAction(i),
    () => true);

export const editDialogCommandFactory = (dialog: MatDialog, snackBar: MatSnackBar, postAction: (i: InterestInbound) => void,
                                         interestCacheService: InterestCacheService): EditDialogCommandOld<InterestInbound> =>
  new EditDialogCommandOld<InterestInbound>(
    'Edit Interest',
    'interest',
    InterestDialogComponent,
    'Interest updated',
    null,
    null,
    dialog,
    snackBar,
    () => ({model: interestCacheService.getFirstSelection()}),
    postAction,
    () => interestCacheService.selection.selected.length === 1);
