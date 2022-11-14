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

import {InjectionToken, INJECTOR, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {SnackbarManager} from '../../../implementation/managers/snackbar-manager';
import {SingleItemCacheUpdater} from '../../../implementation/state-management/single-item-cache-updater';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {ClosedResultType} from '../../../implementation/types/dialog-types';
import {SNACKBAR_MANAGER} from '../../global/global-snackbar-providers';

export function detailAfterClosedDeleteProviders<MODEL_TYPE, SERVICE_TYPE extends TableCache<MODEL_TYPE>>(
  name: InjectionToken<ClosedResultType>,
  serviceToken: InjectionToken<SERVICE_TYPE>,
  routeAfterDelete: string[],
  singleItemCacheUpdaterToken: InjectionToken<SingleItemCacheUpdater<MODEL_TYPE>>,
): any[] {
  return [
    {
      provide: name,
      useFactory: (injector: Injector, snackbarManager: SnackbarManager, router: Router) => {
        const service: SERVICE_TYPE = injector.get(serviceToken)
        const singleItemCacheUpdater: SingleItemCacheUpdater<MODEL_TYPE> = injector.get(singleItemCacheUpdaterToken)
        return (snackbarMessage: string) => result => {
          if (result) {
            snackbarManager.open(snackbarMessage)
            singleItemCacheUpdater.remove()
              .then(() => service.loadData())
              .then(() => service.clearSelection())
              .then(() => router.navigate(routeAfterDelete))
          }
        }
      },
      deps: [INJECTOR, SNACKBAR_MANAGER, Router]
    },
  ]
}
