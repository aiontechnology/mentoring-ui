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
import {DialogManager} from '../../implementation/command/dialog-manager';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from '../../implementation/state-management/single-item-cache-updater';
import {TableCache} from '../../implementation/table-cache/table-cache';
import {ClosedResultType} from '../../implementation/types/dialog-types';
import {ConfimationDialogComponent} from '../../modules/shared/components/confimation-dialog/confimation-dialog.component';
import {detailAfterClosedDeleteProviders} from './detail/detail-after-closed-delete-providers';
import {detailAfterClosedEditProviders} from './detail/detail-after-closed-edit-providers';
import {detailDialogManagerDeleteProviders} from './detail/detail-dialog-manager-delete-providers';
import {detailDialogManagerEditProviders} from './detail/detail-dialog-manager-edit-providers';

const DETAIL_AFTER_CLOSED_DELETE = new InjectionToken<ClosedResultType>('detail-after-closed-delete');
const DETAIL_AFTER_CLOSED_EDIT = new InjectionToken<ClosedResultType>('detail-after-closed-edit');

export function detailDialogManagerProviders<MODEL_TYPE, COMPONENT_TYPE, SERVICE_TYPE extends TableCache<MODEL_TYPE>>(
  editName: InjectionToken<DialogManager<COMPONENT_TYPE>>,
  deleteName: InjectionToken<DialogManager<ConfimationDialogComponent>>,
  componentType: ComponentType<COMPONENT_TYPE>,
  serviceToken: InjectionToken<SERVICE_TYPE>,
  routeAfterDelete: string[],
  singleItemCacheToken: InjectionToken<SingleItemCache<MODEL_TYPE>>,
  singleItemCacheUpdaterToken: InjectionToken<SingleItemCacheUpdater<MODEL_TYPE>>,
): any[] {
  return [
    ...detailAfterClosedDeleteProviders<MODEL_TYPE, SERVICE_TYPE>(DETAIL_AFTER_CLOSED_DELETE, serviceToken, routeAfterDelete, singleItemCacheUpdaterToken),
    ...detailAfterClosedEditProviders<MODEL_TYPE>(DETAIL_AFTER_CLOSED_EDIT, singleItemCacheToken),
    ...detailDialogManagerDeleteProviders(deleteName, DETAIL_AFTER_CLOSED_DELETE),
    ...detailDialogManagerEditProviders<COMPONENT_TYPE>(editName, DETAIL_AFTER_CLOSED_EDIT, componentType)
  ]
}
