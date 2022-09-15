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

import {findSelfLink, Repository} from './repository';

describe('Repository', () => {

  it('should find the self link', () => {
    const value = {
      links: {
        self: [
          {href: 'http://example.com'}
        ]
      }
    };
    const link = findSelfLink(value);
    expect(link).toEqual('http://example.com');
  });

});
