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

import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {EnableableCommand} from './enableable-command';

describe('EnableableCommand', () => {
  let command: TestCommand

  beforeEach(function() {
    command = new TestCommand()
  })

  it('defaults to enabled', () => {
    // execute
    let result = command.isEnabled

    // verify
    expect(result).toBeTruthy()
  })

  it('uses provided enable functions', () => {
    // setup
    command.enableIf(() => false)

    // execute
    let result = command.isEnabled

    // verity
    expect(result).toBeFalsy()
  })

  it('returns false if one enabler is false', () => {
    // setup
    command.enableIf(() => true)
    command.enableIf(() => false)
    command.enableIf(() => true)

    // execute
    let result = command.isEnabled

    // verify
    expect(result).toBeFalsy()
  })
})

class TestCommand extends EnableableCommand {
  protected doExecute(): MatDialogRef<any> {
    return undefined;
  }

}
