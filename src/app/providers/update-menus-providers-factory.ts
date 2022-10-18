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
import {InjectionToken, Injector, INJECTOR} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Command} from '../implementation/command/command';
import {DialogCommand} from '../implementation/command/dialog-command';
import {DialogManager} from '../implementation/command/dialog-manager';
import {AbstractTableCache} from '../implementation/table-cache/abstract-table-cache';
import {titleCase} from '../shared/title-case';

export function updateProvidersFactory<MODEL_TYPE, COMPONENT_TYPE, SERVICE_TYPE extends AbstractTableCache<any>>(
  injectionToken: InjectionToken<Command[]>,
  group: string,
  name: string,
  componentType: ComponentType<COMPONENT_TYPE>,
  serviceToken: InjectionToken<SERVICE_TYPE>) {

  const UPDATE_MENU = new InjectionToken<DialogCommand<MODEL_TYPE>>('update-menu');
  const UPDATE_DIALOG_MANAGER = new InjectionToken<DialogCommand<MODEL_TYPE>>('update-dialog-manager');

  return [
    {
      provide: UPDATE_DIALOG_MANAGER,
      useFactory: (dialog: MatDialog) =>
        DialogManager<COMPONENT_TYPE>.builder(dialog, componentType)
          .withAfterCloseFunction(() => null)
          .build(),
      deps: [MatDialog]
    },
    {
      provide: UPDATE_MENU,
      useFactory: (injector: Injector, dialogManager: DialogManager<COMPONENT_TYPE>) =>
        (isAdminOnly: boolean) => {
          const service: SERVICE_TYPE = injector.get(serviceToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Update ${titleCase(name)}s`, group, dialogManager, () => true)
            .withSnackbarMessage(`${titleCase(name)}s Updated`)
            .withDataSupplier(() => {
              return {localItems: () => service.tableDataSource.data}
            })
            .build()
        },
      deps: [INJECTOR, UPDATE_DIALOG_MANAGER]
    },
    {
      provide: injectionToken,
      useFactory: (updateCommand: (isAdminOnly: boolean) => Command) =>
        [{name: 'update', factory: updateCommand}],
      deps: [UPDATE_MENU]
    },

  ]
}
