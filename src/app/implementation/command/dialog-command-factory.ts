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
import {MenuDialogCommand} from './menu-dialog-command';
import {DialogManager} from './dialog-manager';

/**
 * Class that represents the dataSupplier property of the MenuDialogManagerConfiguration
 */
export class DataSupplier<MODEL_TYPE> {
  model?: MODEL_TYPE
  panelTitle: string
}

/**
 * Class that represents configuration parameters that can be provided in order to create a MenuDialogCommand
 */
export class MenuDialogManagerConfiguration<MODEL_TYPE> {
  constructor(
    public dataSupplier: () => DataSupplier<MODEL_TYPE>,
    public adminOnly: boolean,
    public snackbarMessage: string,
    public menuTitle: string = '',
    public menuGroup: string = '',
  ) {}
}

/**
 * Type that represents a function that takes a MenuDialogConfiguration and returns a MenuDialogCommand
 */
export type MenuDialogCommandFactory<MODEL_TYPE, COMPONENT_TYPE> =
  (config: MenuDialogManagerConfiguration<MODEL_TYPE>) => MenuDialogCommand<COMPONENT_TYPE>

/**
 * Function that accepts a DialogManager and returns a function that takes a MenuDialogManagerConfiguration and returns a MenuDialogCommand.
 * @param dialogManager
 */
export function createMenuDialogCommandFactory<MODEL_TYPE, COMPONENT_TYPE>(dialogManager: DialogManager<COMPONENT_TYPE>):
  MenuDialogCommandFactory<MODEL_TYPE, COMPONENT_TYPE> {
  return (config: MenuDialogManagerConfiguration<MODEL_TYPE>) =>
    MenuDialogCommand<COMPONENT_TYPE>
      .builder(config.menuTitle, config.menuGroup, dialogManager)
      .withDataSupplier(config.dataSupplier)
      .withSnackbarMessage(config.snackbarMessage)
      .withAdminOnly(config.adminOnly)
      .build()
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
