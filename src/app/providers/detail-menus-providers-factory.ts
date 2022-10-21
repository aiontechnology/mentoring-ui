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
import {SNACKBAR_MANAGER} from '../app.module';
import {Command} from '../implementation/command/command';
import {DialogCommand} from '../implementation/command/dialog-command';
import {DialogManager} from '../implementation/command/dialog-manager';
import {SnackbarManager} from '../implementation/command/snackbar-manager';
import {SingleItemCache} from '../implementation/data/single-item-cache';
import {TableCache} from '../implementation/table-cache/table-cache';
import {ConfimationDialogComponent} from '../modules/shared/components/confimation-dialog/confimation-dialog.component';
import {titleCase} from '../implementation/shared/title-case';

export function detailProvidersFactory<MODEL_TYPE, COMPONENT_TYPE, SERVICE_TYPE extends TableCache<MODEL_TYPE>>(
  injectionToken: InjectionToken<Command[]>,
  group: string,
  name: string, routeAfterDelete: string[],
  componentType: ComponentType<COMPONENT_TYPE>,
  serviceToken: InjectionToken<SERVICE_TYPE>,
  singleItemCacheToken: InjectionToken<SingleItemCache<MODEL_TYPE>>) {

  const DETAIL_AFTER_CLOSED_DELETE = new InjectionToken<(s: string) => (a: any) => void>('detail-after-closed-delete');
  const DETAIL_AFTER_CLOSED_EDIT = new InjectionToken<(s: string) => (a: any) => void>('detail-after-closed-edit');
  const DETAIL_DIALOG_MANAGER_DELETE = new InjectionToken<DialogManager<ConfimationDialogComponent>>('detail-dialog-manager-delete');
  const DETAIL_DIALOG_MANAGER_EDIT = new InjectionToken<DialogManager<COMPONENT_TYPE>>('detail-dialog-manager-edit');
  const DETAIL_MENU_DELETE = new InjectionToken<DialogCommand<MODEL_TYPE>>('detail-menu-delete');
  const DETAIL_MENU_EDIT = new InjectionToken<DialogCommand<MODEL_TYPE>>('detail-menu-edit');

  return [
    // Detail delete manager
    {
      provide: DETAIL_DIALOG_MANAGER_DELETE,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<ConfimationDialogComponent>.builder(dialog, ConfimationDialogComponent)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, DETAIL_AFTER_CLOSED_DELETE]
    },
    {
      provide: DETAIL_AFTER_CLOSED_DELETE,
      useFactory: (injector: Injector, snackbarManager: SnackbarManager, router: Router) => {
        const service: SERVICE_TYPE = injector.get(serviceToken)
        const singleItemCache: SingleItemCache<MODEL_TYPE> = injector.get(singleItemCacheToken)
        return (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
            singleItemCache.remove()
              .then(() => service.loadData())
              .then(() => service.clearSelection())
              .then(() => router.navigate(routeAfterDelete))
          }
        }
      },
      deps: [INJECTOR, SNACKBAR_MANAGER, Router]
    },

    // Detail edit dialog manager
    {
      provide: DETAIL_DIALOG_MANAGER_EDIT,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<COMPONENT_TYPE>.builder(dialog, componentType)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, DETAIL_AFTER_CLOSED_EDIT]
    },
    {
      provide: DETAIL_AFTER_CLOSED_EDIT,
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

    // Menu definitions for details
    {
      provide: DETAIL_MENU_DELETE,
      useFactory: (injector: Injector, dialogManager: DialogManager<ConfimationDialogComponent>) =>
        (isAdminOnly: boolean) => {
          const singleItemCache: SingleItemCache<MODEL_TYPE> = injector.get(singleItemCacheToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Remove ${titleCase(name)}`, group, dialogManager, () => true)
            .withAdminOnly(isAdminOnly)
            .withSnackbarMessage(`${titleCase(name)} Removed`)
            .withDataSupplier(() => ({
              model: singleItemCache.item,
              singularName: name,
              pluralName: `${name}s`,
              countSupplier: () => 1
            }))
            .build()
        },
      deps: [INJECTOR, DETAIL_DIALOG_MANAGER_DELETE]
    },
    {
      provide: DETAIL_MENU_EDIT,
      useFactory: (injector: Injector, dialogManager: DialogManager<COMPONENT_TYPE>) =>
        (isAdminOnly: boolean) => {
          const singleItemCache: SingleItemCache<MODEL_TYPE> = injector.get(singleItemCacheToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Edit ${titleCase(name)}`, group, dialogManager, () => true)
            .withAdminOnly(isAdminOnly)
            .withSnackbarMessage(`${titleCase(name)} Edited`)
            .withDataSupplier(() => ({model: singleItemCache.item}))
            .build()
        },
      deps: [INJECTOR, DETAIL_DIALOG_MANAGER_EDIT]
    },
    {
      provide: injectionToken,
      useFactory: (deleteCommand: (isAdminOnly: boolean) => Command,
                   editCommand: (isAdminOnly: boolean) => Command) =>
        [{name: 'edit', factory: editCommand}, {name: 'delete', factory: deleteCommand}],
      deps: [DETAIL_MENU_DELETE, DETAIL_MENU_EDIT]
    },
  ]
}
