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
import {NavigationManager} from '../../implementation/command/navigation-manager';
import {SnackbarManager} from '../../implementation/managers/snackbar-manager';
import {ClosedResultType} from '../../implementation/types/dialog-types';
import {LIST_POST_ACTION} from '../dialog-manager-providers';
import {SNACKBAR_MANAGER} from '../global/global-snackbar-providers';

export function listAfterClosedEditProviders<MODEL_TYPE>(
  name: InjectionToken<ClosedResultType>,
  navigationManagerToken: InjectionToken<NavigationManager>,
): any[] {
  return [
    {
      provide: name,
      useFactory: (
        navigationManager: NavigationManager,
        snackbarManager: SnackbarManager,
        listPostAction: (item: MODEL_TYPE) => Promise<void>
      ): ClosedResultType =>
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
      deps: [navigationManagerToken, SNACKBAR_MANAGER, LIST_POST_ACTION]
    },
  ]
}
