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

import {Command} from './command';

describe('Command', () => {
  let command: TestCommand

  beforeEach(function() {
    command = new TestCommand()
  })

  it('calls template methods in the correct order', () => {
    // execute
    command.execute()

    // verify
    expect(command.callOrder.pop()).toEqual('doPreExecute')
    expect(command.callOrder.pop()).toEqual('doExecute')
    expect(command.callOrder.pop()).toEqual('doPostExecute')
    expect(command.callOrder.length).toEqual(0)
  })

  it('passes the execution result to doPostExecute', () => {
    // execute
    spyOn(command, 'doPostExecute')
    command.execute()

    // verify
    expect(command.doPostExecute).toHaveBeenCalled()
  })
})

class TestCommand extends Command {
  callOrder = []

  doPreExecute() {
    this.callOrder.unshift('doPreExecute')
  }

  doExecute(): void {
    this.callOrder.unshift('doExecute')
  }

  doPostExecute() {
    this.callOrder.unshift('doPostExecute')
  }
}
