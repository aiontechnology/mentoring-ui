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

import {convertEmptyStringToNull} from '../../functions/value-or-null';

export class SchoolSession {
  id: string
  label: string
  isCurrent: boolean
  links: {
    self: [
      { href: string }
    ]
  };

  constructor(json?: any) {
    this.id = convertEmptyStringToNull(json?.id)
    this.label = convertEmptyStringToNull(json?.label)
    this.isCurrent = json?.isCurrent;
    this.links = json?.links;
  }

  get labelWithCurrent(): string {
    let label = this.label;
    label += this.isCurrent ? ' (current)' : '';
    return label;
  }
}
