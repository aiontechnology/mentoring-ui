/*
 * Copyright 2021-2022 Aion Technology LLC
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

import {InjectionToken, NgModule} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from 'src/app/modules/shared/shared.module';
import {SNACKBAR_MANAGER} from '../../app.module';
import {Command} from '../../implementation/command/command';
import {DialogCommand} from '../../implementation/command/dialog-command';
import {DialogManager} from '../../implementation/command/dialog-manager';
import {SnackbarManager} from '../../implementation/command/snackbar-manager';
import {BookDialogComponent} from '../resource-manager/components/book-dialog/book-dialog.component';
import {Book} from '../shared/models/book/book';
import {AdminManagerComponent} from './admin-manager.component';
import {InterestDialogComponent} from './components/interest-dialog/interest-dialog.component';
import {InterestListComponent} from './components/interest-list/interest-list.component';
import {InterestInbound} from './models/interest/interest-inbound';
import {InterestCacheService} from './services/interests/interest-cache.service';

const routes: Routes = [
  {
    path: '',
    component: AdminManagerComponent,
    children: [
      {path: '', component: InterestListComponent},
    ]
  }
];

export const ADMIN_LIST_AFTER_CLOSED_EDIT = new InjectionToken<(s: string) => (a: any) => void>('admin-list-after-closed-edit');
export const ADMIN_LIST_DIALOG_MANAGER_EDIT = new InjectionToken<DialogManager<BookDialogComponent>>('admin-list-dialog-manager-edit');
export const ADMIN_LIST_MENU = new InjectionToken<Command[]>('admin-list-menu');
export const ADMIN_LIST_MENU_ADD = new InjectionToken<DialogCommand<Book>>('admin-list-menu-add');
export const ADMIN_LIST_MENU_EDIT = new InjectionToken<DialogCommand<Book>>('admin-list-menu-edit');
export const ADMIN_LIST_POST_ACTION = new InjectionToken<DialogCommand<Book>>('admin-list-post-action');

/**
 * This module manages the system administrator's abilities.
 */
@NgModule({
  declarations: [
    AdminManagerComponent,
    InterestListComponent,
    InterestDialogComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [
    InterestCacheService,

    // ********************************************************************************
    // Interests **********************************************************************
    // ********************************************************************************

    // List edit dialog manager
    {
      provide: ADMIN_LIST_DIALOG_MANAGER_EDIT,
      useFactory: (dialog: MatDialog, afterCloseFunction: (s: string) => (a: any) => void) =>
        DialogManager<InterestDialogComponent>.builder(dialog, InterestDialogComponent)
          .withAfterCloseFunction(afterCloseFunction)
          .build(),
      deps: [MatDialog, ADMIN_LIST_AFTER_CLOSED_EDIT]
    },
    {
      provide: ADMIN_LIST_AFTER_CLOSED_EDIT,
      useFactory: (interestCacheService: InterestCacheService, snackbarManager: SnackbarManager,
                   listPostAction: (interest: InterestInbound) => Promise<void>) =>
        (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
            listPostAction(result)
          }
        },
      deps: [InterestCacheService, SNACKBAR_MANAGER, ADMIN_LIST_POST_ACTION]
    },

    // Menu definitions for interest list
    {
      provide: ADMIN_LIST_MENU_ADD,
      useFactory: (dialogManager: DialogManager<InterestDialogComponent>) => DialogCommand<InterestInbound>
        .builder('Add Interest', 'interest', dialogManager, () => true)
        .withSnackbarMessage('Interest added')
        .build(),
      deps: [ADMIN_LIST_DIALOG_MANAGER_EDIT]
    },
    {
      provide: ADMIN_LIST_MENU_EDIT,
      useFactory: (interestCacheComponent: InterestCacheService, dialogManager: DialogManager<InterestDialogComponent>) => DialogCommand<InterestInbound>
        .builder('Edit Interest', 'interest', dialogManager, () => interestCacheComponent.selection.selected.length === 1)
        .withDataSupplier(() => ({model: interestCacheComponent.getFirstSelection()}))
        .withSnackbarMessage('Interest edited')
        .build(),
      deps: [InterestCacheService, ADMIN_LIST_DIALOG_MANAGER_EDIT]
    },
    {
      provide: ADMIN_LIST_MENU,
      useFactory: (addCommand: Command, editCommand: Command) => [addCommand, editCommand],
      deps: [ADMIN_LIST_MENU_ADD, ADMIN_LIST_MENU_EDIT]
    },
    {
      provide: ADMIN_LIST_POST_ACTION,
      useFactory: (cacheService: InterestCacheService): (interest: InterestInbound) => Promise<void> =>
        interest => cacheService.loadInterests()
          .then(() => {
            cacheService.clearSelection();
            cacheService.jumpToItem(interest);
          }),
      deps: [InterestCacheService]
    },
  ]
})
export class AdminManagerModule {}
