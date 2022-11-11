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
import {DialogManager} from '../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../implementation/command/menu-dialog-command';
import {NavigationManager} from '../implementation/command/navigation-manager';
import {TableCache} from '../implementation/table-cache/table-cache';
import {ClosedResultType} from '../implementation/types/dialog-types';
import {ConfimationDialogComponent} from '../modules/shared/components/confimation-dialog/confimation-dialog.component';
import {listAfterClosedDeleteProviders} from './dialog/list-after-closed-delete-providers';
import {listAfterClosedEditProviders} from './dialog/list-after-closed-edit-providers';
import {listDialogManagerDeleteProviders} from './dialog/list-dialog-manager-delete-providers';
import {listDialogManagerEditProviders} from './dialog/list-dialog-manager-edit-providers';
import {listPostActionProviders} from './dialog/list-post-action-providers';
import {navigationManagerProviders} from './dialog/navigation-manager-providers';

export const NULL_NAVIGATION_MANAGER = new InjectionToken<NavigationManager>('null-navigation-manager');
export const LIST_POST_ACTION = new InjectionToken<MenuDialogCommand<any>>('list-post-action');
export const LIST_AFTER_CLOSED_DELETE = new InjectionToken<ClosedResultType>('list-after-closed-delete');
export const LIST_AFTER_CLOSED_EDIT = new InjectionToken<ClosedResultType>('list-after-closed-edit');

export function dialogManagerProviders<MODEL_TYPE, COMPONENT_TYPE, SERVICE_TYPE extends TableCache<MODEL_TYPE>>(
  editName: InjectionToken<DialogManager<COMPONENT_TYPE>>,
  deleteName: InjectionToken<DialogManager<ConfimationDialogComponent>>,
  componentType: ComponentType<COMPONENT_TYPE>,
  serviceToken: InjectionToken<SERVICE_TYPE>,
) {
  return [
    ...navigationManagerProviders(NULL_NAVIGATION_MANAGER),
    ...listPostActionProviders<MODEL_TYPE, SERVICE_TYPE>(LIST_POST_ACTION, serviceToken),
    ...listAfterClosedDeleteProviders<MODEL_TYPE, SERVICE_TYPE>(LIST_AFTER_CLOSED_DELETE, serviceToken),
    ...listAfterClosedEditProviders<MODEL_TYPE>(LIST_AFTER_CLOSED_EDIT, NULL_NAVIGATION_MANAGER),
    ...listDialogManagerDeleteProviders(deleteName),
    ...listDialogManagerEditProviders<COMPONENT_TYPE>(editName, componentType),
  ]
}
