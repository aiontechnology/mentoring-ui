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
import {ClosedResultType} from '../../implementation/types/dialog-types';
import {standAloneAfterClosedEditProviders} from './stand-alone/stand-alone-after-closed-edit-providers';
import {standAloneDialogManagerEditProviders} from './stand-alone/stand-alone-dialog-manager-edit-providers';

const STAND_ALONE_AFTER_CLOSED_EDIT = new InjectionToken<ClosedResultType>('stand-alone-after-closed-edit');

export function standAloneDialogManagerProviders<COMPONENT_TYPE>(
  name: InjectionToken<DialogManager<COMPONENT_TYPE>>,
  componentType: ComponentType<COMPONENT_TYPE>,
): any[] {
  return [
    ...standAloneAfterClosedEditProviders(STAND_ALONE_AFTER_CLOSED_EDIT),
    ...standAloneDialogManagerEditProviders<COMPONENT_TYPE>(name, STAND_ALONE_AFTER_CLOSED_EDIT, componentType),
  ]
}
