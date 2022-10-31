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
import {InjectionToken, INJECTOR, Injector} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {SNACKBAR_MANAGER} from '../../../app.module';
import {Command} from '../../../implementation/command/command';
import {DialogCommand} from '../../../implementation/command/dialog-command';
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {SnackbarManager} from '../../../implementation/command/snackbar-manager';
import {SingleItemCache} from '../../../implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from '../../../implementation/state-management/single-item-cache-updater';
import {titleCase} from '../../../implementation/shared/title-case';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';

export function programAdminMenuProvidersFactory<MODEL_TYPE, COMPONENT_TYPE>(
  injectionToken: InjectionToken<Command[]>,
  group: string,
  name: string,
  routeAfterDelete: string[],
  componentType: ComponentType<COMPONENT_TYPE>,
  singleItemCacheToken: InjectionToken<SingleItemCache<MODEL_TYPE>>,
  singleItemCacheUpdaterToken: InjectionToken<SingleItemCacheUpdater<MODEL_TYPE>>,
) {

  const AFTER_CLOSED_DELETE = new InjectionToken<(s: string) => (a: any) => void>('after-closed-delete');
  const AFTER_CLOSED_EDIT = new InjectionToken<(s: string) => (a: any) => void>('after-closed-edit');
  const DIALOG_MANAGER_DELETE = new InjectionToken<DialogManager<ConfimationDialogComponent>>('dialog-manager-delete');
  const DIALOG_MANAGER_EDIT = new InjectionToken<DialogManager<COMPONENT_TYPE>>('ialog-manager-edit');

  const MENU_ADD = new InjectionToken<DialogCommand<MODEL_TYPE>>('menu-add');
  const MENU_DELETE = new InjectionToken<DialogCommand<MODEL_TYPE>>('menu-delete');
  const MENU_EDIT = new InjectionToken<DialogCommand<MODEL_TYPE>>('menu-edit');

  return [
    // Delete dialog manager
    {
      provide: DIALOG_MANAGER_DELETE,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<ConfimationDialogComponent>.builder(dialog, ConfimationDialogComponent)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, AFTER_CLOSED_DELETE]
    },
    {
      provide: AFTER_CLOSED_DELETE,
      useFactory: (injector: Injector, snackbarManager: SnackbarManager, router: Router) => {
        const singleItemCacheUpdater: SingleItemCacheUpdater<MODEL_TYPE> = injector.get(singleItemCacheUpdaterToken)
        return (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
            singleItemCacheUpdater.remove()
              .then(() => router.navigate(routeAfterDelete))
          }
        }
      },
      deps: [INJECTOR, SNACKBAR_MANAGER, Router]
    },

    // Edit dialog manager
    {
      provide: DIALOG_MANAGER_EDIT,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<COMPONENT_TYPE>.builder(dialog, componentType)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, AFTER_CLOSED_EDIT]
    },
    {
      provide: AFTER_CLOSED_EDIT,
      useFactory: (injector: Injector, snackbarManager: SnackbarManager) => {
        const singleItemCache: SingleItemCache<MODEL_TYPE> = injector.get(singleItemCacheToken)
        return (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
            singleItemCache.item = result
          }
        }
      },
      deps: [INJECTOR, SNACKBAR_MANAGER]
    },

    // Menu definitions for program admin detail
    {
      provide: MENU_ADD,
      useFactory: (injector: Injector, dialogManager: DialogManager<COMPONENT_TYPE>) =>
        (isAdminOnly: boolean) => {
          const singleItemCache: SingleItemCache<MODEL_TYPE> = injector.get(singleItemCacheToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Add ${titleCase(name)}`, group, dialogManager, () => singleItemCache.item === undefined)
            .withSnackbarMessage(`${titleCase(name)} Added`)
            .build()
        },
      deps: [INJECTOR, DIALOG_MANAGER_EDIT]
    },
    {
      provide: MENU_DELETE,
      useFactory: (injector: Injector, dialogManager: DialogManager<ConfimationDialogComponent>) =>
        (isAdminOnly: boolean) => {
          const singleItemCache: SingleItemCache<MODEL_TYPE> = injector.get(singleItemCacheToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Remove ${titleCase(name)}`, group, dialogManager, () => singleItemCache.item !== undefined)
            .withSnackbarMessage(`${titleCase(name)} Removed`)
            .withDataSupplier(() => ({
              model: singleItemCache.item,
              singularName: name,
              pluralName: `${name}s`,
              countSupplier: () => 1
            }))
            .build()
        },
      deps: [INJECTOR, DIALOG_MANAGER_DELETE]
    },
    {
      provide: MENU_EDIT,
      useFactory: (injector: Injector, dialogManager: DialogManager<COMPONENT_TYPE>) =>
        (isAdminOnly: boolean) => {
          const singleItemCache: SingleItemCache<MODEL_TYPE> = injector.get(singleItemCacheToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Edit ${titleCase(name)}`, group, dialogManager, () => singleItemCache.item !== undefined)
            .withSnackbarMessage(`${titleCase(name)} Edited`)
            .withDataSupplier(() => ({model: singleItemCache.item}))
            .build()
        },
      deps: [INJECTOR, DIALOG_MANAGER_EDIT]
    },
    {
      provide: injectionToken,
      useFactory: (addCommand: (isAdminOnly: boolean) => Command,
                   deleteCommand: (isAdminOnly: boolean) => Command,
                   editCommand: (isAdminOnly: boolean) => Command) =>
        [{name: 'add', factory: addCommand}, {name: 'delete', factory: editCommand}, {name: 'edit', factory: deleteCommand}],
      deps: [MENU_ADD, MENU_DELETE, MENU_EDIT]
    },
  ]
}
