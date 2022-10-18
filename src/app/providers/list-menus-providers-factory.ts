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
import {NavigationManager} from '../implementation/command/navigation-manager';
import {SnackbarManager} from '../implementation/command/snackbar-manager';
import {TableCache} from '../implementation/table-cache/table-cache';
import {ConfimationDialogComponent} from '../modules/shared/components/confimation-dialog/confimation-dialog.component';
import {titleCase} from '../shared/title-case';

export function listProvidersFactory<MODEL_TYPE, COMPONENT_TYPE, SERVICE_TYPE extends TableCache<MODEL_TYPE>>(
  injectionToken: InjectionToken<Command[]>,
  group: string,
  name: string,
  componentType: ComponentType<COMPONENT_TYPE>,
  serviceToken: InjectionToken<SERVICE_TYPE>) {

  const NAVIGATION_MANAGER = new InjectionToken<NavigationManager>('navigation-manager');

  const LIST_AFTER_CLOSED_DELETE = new InjectionToken<(s: string) => (a: any) => void>('list-after-closed-delete');
  const LIST_AFTER_CLOSED_EDIT = new InjectionToken<(s: string) => (a: any) => void>('list-after-closed-edit');
  const LIST_DIALOG_MANAGER_DELETE = new InjectionToken<DialogManager<ConfimationDialogComponent>>('list-dialog-manager-delete');
  const LIST_DIALOG_MANAGER_EDIT = new InjectionToken<DialogManager<COMPONENT_TYPE>>('list-dialog-manager-edit');
  const LIST_MENU_ADD = new InjectionToken<DialogCommand<MODEL_TYPE>>('list-menu-add');
  const LIST_MENU_EDIT = new InjectionToken<DialogCommand<MODEL_TYPE>>('list-menu-edit');
  const LIST_MENU_DELETE = new InjectionToken<DialogCommand<MODEL_TYPE>>('list-menu-delete');
  const LIST_POST_ACTION = new InjectionToken<DialogCommand<MODEL_TYPE>>('list-post-action');

  return [
    // Navigation
    {
      provide: NAVIGATION_MANAGER,
      useFactory: (router: Router) => new NavigationManager(router, ['/', 'resourcemanager', 'books']),
      deps: [Router]
    },

    // List delete dialog manager
    {
      provide: LIST_DIALOG_MANAGER_DELETE,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<ConfimationDialogComponent>.builder(dialog, ConfimationDialogComponent)
          .withAfterCloseFunction(afterCloseFunction)
          .withConfig({width: '500px', disableClose: true})
          .build(),
      deps: [MatDialog, LIST_AFTER_CLOSED_DELETE]
    },
    {
      provide: LIST_AFTER_CLOSED_DELETE,
      useFactory: (injector: Injector, snackbarManager: SnackbarManager) =>
        (snackbarMessage: string) =>
          async result => {
            if (result) {
              const service: SERVICE_TYPE = injector.get(serviceToken)
              await service.removeSelected()
              await snackbarManager.open(snackbarMessage)
              await service.loadData()
              service.clearSelection()
            }
          },
      deps: [INJECTOR, SNACKBAR_MANAGER]
    },

    // List edit dialog manager
    {
      provide: LIST_DIALOG_MANAGER_EDIT,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<COMPONENT_TYPE>.builder(dialog, componentType)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, LIST_AFTER_CLOSED_EDIT]
    },
    {
      provide: LIST_AFTER_CLOSED_EDIT,
      useFactory: (navigationManager: NavigationManager, snackbarManager: SnackbarManager, listPostAction: (item: MODEL_TYPE) => Promise<void>) =>
        (snackbarMessage: string) => result => {
          if (result) {
            if (navigationManager) {
              snackbarManager.open(snackbarMessage, 'Navigate').onAction()
                .subscribe(() => navigationManager.navigate(result.id))
            } else {
              snackbarManager.open(snackbarMessage)
            }
            listPostAction(result)
          }
        },
      deps: [NAVIGATION_MANAGER, SNACKBAR_MANAGER, LIST_POST_ACTION]
    },

    // Menu definitions for lists
    {
      provide: LIST_MENU_ADD,
      useFactory: (dialogManager: DialogManager<COMPONENT_TYPE>) =>
        (isAdminOnly: boolean) =>
          DialogCommand<MODEL_TYPE>
            .builder(`Add ${titleCase(name)}`, group, dialogManager, () => true)
            .withAdminOnly(isAdminOnly)
            .withSnackbarMessage(`${titleCase(name)} Added`)
            .build(),
      deps: [LIST_DIALOG_MANAGER_EDIT]
    },
    {
      provide: LIST_MENU_EDIT,
      useFactory: (injector: Injector, dialogManager: DialogManager<COMPONENT_TYPE>) =>
        (isAdminOnly: boolean) => {
          const service: SERVICE_TYPE = injector.get(serviceToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Edit ${titleCase(name)}`, group, dialogManager, () => service.selection.selected.length === 1)
            .withAdminOnly(isAdminOnly)
            .withDataSupplier(() => ({model: service.getFirstSelection()}))
            .withSnackbarMessage(`${titleCase(name)} Edited`)
            .build()
        },
      deps: [INJECTOR, LIST_DIALOG_MANAGER_EDIT]
    },
    {
      provide: LIST_MENU_DELETE,
      useFactory: (injector: Injector, dialogManager: DialogManager<ConfimationDialogComponent>) =>
        (isAdminOnly: boolean) => {
          const service: SERVICE_TYPE = injector.get(serviceToken)
          return DialogCommand<MODEL_TYPE>
            .builder(`Remove ${titleCase(name)}(s)`, group, dialogManager, () => service.selection.selected.length > 0)
            .withAdminOnly(isAdminOnly)
            .withDataSupplier(() => {
              return {
                singularName: name,
                pluralName: `${name}s`,
                countSupplier: () => service.selectionCount
              }
            })
            .withSnackbarMessage(`${titleCase(name)}(s) Removed`)
            .build()
        },
      deps: [INJECTOR, LIST_DIALOG_MANAGER_DELETE]
    },
    {
      provide: injectionToken,
      useFactory: (addCommand: (isAdminOnly: boolean) => Command,
                   deleteCommand: (isAdminOnly: boolean) => Command,
                   editCommand: (isAdminOnly: boolean) => Command) =>
        [{name: 'add', factory: addCommand}, {name: 'edit', factory: editCommand}, {name: 'delete', factory: deleteCommand}],
      deps: [LIST_MENU_ADD, LIST_MENU_DELETE, LIST_MENU_EDIT]
    },
    {
      provide: LIST_POST_ACTION,
      useFactory: (injector: Injector) => {
        const service: SERVICE_TYPE = injector.get(serviceToken)
        return (item) => service.loadData()
          .then(() => {
            service.clearSelection();
            if (item) {
              service.jumpToItem(item);
            }
          })
      },
      deps: [INJECTOR]
    },
  ]
}
