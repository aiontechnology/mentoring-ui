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

import {DialogCommand} from './dialog-command';
import {DialogManager} from './dialog-manager';

/**
 * Class that represents the dataSupplier property of the MenuDialogManagerConfiguration
 */
export class DataSupplier<MODEL_TYPE> {
  model?: MODEL_TYPE
  panelTitle: string
}

export class DialogManagerConfiguration<MODEL_TYPE> {
  constructor(
    public dataSupplier: () => DataSupplier<MODEL_TYPE>,
    public snackbarMessage: string,
  ) {}
}

export type DialogCommandFactory<MODEL_TYPE, COMPONENT_TYPE> =
  (config: DialogManagerConfiguration<MODEL_TYPE>) => DialogCommand<COMPONENT_TYPE>

export function createDialogCommandFactory<MODEL_TYPE, COMPONENT_TYPE>(dialogManager: DialogManager<COMPONENT_TYPE>):
  DialogCommandFactory<MODEL_TYPE, COMPONENT_TYPE> {
  return (config: DialogManagerConfiguration<MODEL_TYPE>) =>
    DialogCommand<COMPONENT_TYPE>
      .builder(dialogManager)
      .withDataSupplier(config.dataSupplier)
      .withSnackbarMessage(config.snackbarMessage)
      .build()
}
