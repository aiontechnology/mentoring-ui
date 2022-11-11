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

import {InjectionToken} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogManager} from '../../implementation/command/dialog-manager';
import {ClosedResultType} from '../../implementation/types/dialog-types';
import {ConfimationDialogComponent} from '../../modules/shared/components/confimation-dialog/confimation-dialog.component';
import {LIST_AFTER_CLOSED_DELETE} from '../dialog-manager-providers';

export function listDialogManagerDeleteProviders(
  name: InjectionToken<DialogManager<ConfimationDialogComponent>>
): any[] {
  return [
    {
      provide: name,
      useFactory: (dialog: MatDialog, afterCloseFunction: ClosedResultType) =>
        DialogManager<ConfimationDialogComponent>.builder(dialog, ConfimationDialogComponent)
          .withAfterCloseFunction(afterCloseFunction)
          .withConfig({width: '500px', disableClose: true})
          .build(),
      deps: [MatDialog, LIST_AFTER_CLOSED_DELETE]
    },
  ]
}
