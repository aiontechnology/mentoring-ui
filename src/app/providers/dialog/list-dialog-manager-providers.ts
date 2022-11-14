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
import {NavigationManager} from '../../implementation/command/navigation-manager';
import {TableCache} from '../../implementation/table-cache/table-cache';
import {ClosedResultType} from '../../implementation/types/dialog-types';
import {AnyConsumer} from '../../implementation/types/types';
import {ConfimationDialogComponent} from '../../modules/shared/components/confimation-dialog/confimation-dialog.component';
import {navigationManagerProviders} from '../general/navigation-manager-providers';
import {listAfterClosedDeleteProviders} from './list/list-after-closed-delete-providers';
import {listAfterClosedEditProviders} from './list/list-after-closed-edit-providers';
import {listDialogManagerDeleteProviders} from './list/list-dialog-manager-delete-providers';
import {listDialogManagerEditProviders} from './list/list-dialog-manager-edit-providers';
import {listPostActionProviders} from './list/list-post-action-providers';

export function listDialogManagerProviders<MODEL_TYPE, COMPONENT_TYPE, SERVICE_TYPE extends TableCache<MODEL_TYPE>>(
  prefix: string,
  editName: InjectionToken<DialogManager<COMPONENT_TYPE>>,
  deleteName: InjectionToken<DialogManager<ConfimationDialogComponent>>,
  componentType: ComponentType<COMPONENT_TYPE>,
  serviceToken: InjectionToken<SERVICE_TYPE>,
) {
  const LIST_AFTER_CLOSED_DELETE = new InjectionToken<ClosedResultType>(`${prefix}-list-after-closed-delete`);
  const LIST_AFTER_CLOSED_EDIT = new InjectionToken<ClosedResultType>(`${prefix}-list-after-closed-edit`);
  const LIST_POST_ACTION = new InjectionToken<AnyConsumer>(`${prefix}-list-post-action`);

  const NULL_NAVIGATION_MANAGER = new InjectionToken<NavigationManager>(`${prefix}-null-navigation-manager`);

  return [
    ...listAfterClosedDeleteProviders<MODEL_TYPE, SERVICE_TYPE>(LIST_AFTER_CLOSED_DELETE, serviceToken),
    ...listAfterClosedEditProviders<MODEL_TYPE>(LIST_AFTER_CLOSED_EDIT, LIST_POST_ACTION, NULL_NAVIGATION_MANAGER),
    ...listDialogManagerDeleteProviders(deleteName, LIST_AFTER_CLOSED_DELETE),
    ...listDialogManagerEditProviders<COMPONENT_TYPE>(editName, LIST_AFTER_CLOSED_EDIT, componentType),
    ...listPostActionProviders<MODEL_TYPE, SERVICE_TYPE>(LIST_POST_ACTION, serviceToken),

    ...navigationManagerProviders(NULL_NAVIGATION_MANAGER),
  ]
}
