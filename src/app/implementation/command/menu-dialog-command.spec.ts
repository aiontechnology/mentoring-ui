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

import {ObjectSupplier} from '../types/types';
import {MenuDialogCommand} from './menu-dialog-command';
import {DialogManager} from './dialog-manager';

describe('DialogMenuCommand', () => {
  describe('DialogMenuCommandBuilder', () => {
    it('builds with required values', () => {
      // set up
      let dialogManager = {} as DialogManager<any>
      const builder = MenuDialogCommand.builder('Title', 'Group', dialogManager)

      // execute
      const result = builder.build()

      // verify
      expect(result.title).toEqual('Title')
      expect(result.group).toEqual('Group')
      expect(result.isEnabled).toBeTruthy()
      expect(result.isAdminOnly).toBeFalsy()
    })

    it('builds with optional values', () => {
      // set up
      let dialogManager = {} as DialogManager<any>
      const builder = MenuDialogCommand.builder('Title', 'Group', dialogManager)
        .withAdminOnly(true)
        .withDataSupplier(() => new Object())
        .withSnackbarMessage('Message')

      // execute
      const result = builder.build()

      // verify
      expect(result.title).toEqual('Title')
      expect(result.group).toEqual('Group')
      expect(result.isEnabled).toBeTruthy()
      expect(result.isAdminOnly).toBeTruthy()
    })
  })

  describe('DialogMenuCommand', () => {
    it('execute to open the dialog', () => {
      // set up
      let dialogManager = { open: (snackbar: string, dataSupplier: ObjectSupplier) => {} } as DialogManager<any>
      spyOn(dialogManager, 'open')

      const dataSupplier = () => new Object({ test: 'hello'})
      const dialogCommand = MenuDialogCommand.builder('Title', 'Group', dialogManager)
        .withAdminOnly(true)
        .withDataSupplier(dataSupplier)
        .withSnackbarMessage('Message')
        .build()

      // execute
      dialogCommand.execute()
      expect(dialogManager.open).toHaveBeenCalledOnceWith('Message', dataSupplier)
    })
  })
})
