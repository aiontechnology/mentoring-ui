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

import {ComponentType} from '@angular/cdk/portal';
import {InjectionToken} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {createDialogCommandFactory} from '../../implementation/command/dialog-command-factory';
import {DialogManager} from '../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../implementation/command/menu-dialog-command';
import {SnackbarManager} from '../../implementation/managers/snackbar-manager';
import {ClosedResultType} from '../../implementation/types/dialog-types';
import {SNACKBAR_MANAGER} from '../global/global-snackbar-providers';

export function addDialogProvidersFactory<MODEL_TYPE, COMPONENT_TYPE>(
  injectionToken: InjectionToken<MenuDialogCommand<MODEL_TYPE>>,
  componentType: ComponentType<COMPONENT_TYPE>,
) {
  const AFTER_CLOSED_EDIT = new InjectionToken<ClosedResultType>('list-after-closed-edit');
  const DIALOG_MANAGER_EDIT = new InjectionToken<DialogManager<COMPONENT_TYPE>>('dialog-manager-edit');

  return [
    {
      provide: DIALOG_MANAGER_EDIT,
      useFactory: (dialog: MatDialog, afterCloseFunction: ClosedResultType) =>
        DialogManager<COMPONENT_TYPE>.builder(dialog, componentType)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, AFTER_CLOSED_EDIT]
    },
    {
      provide: AFTER_CLOSED_EDIT,
      useFactory: (snackbarManager: SnackbarManager) =>
        (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
          }
        },
      deps: [SNACKBAR_MANAGER]
    },
    {
      provide: injectionToken,
      useFactory: (dialogManager: DialogManager<COMPONENT_TYPE>) => createDialogCommandFactory(dialogManager),
      deps: [DIALOG_MANAGER_EDIT]
    },
  ]
}
