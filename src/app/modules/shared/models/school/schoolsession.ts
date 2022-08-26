/*
 * Copyright 2022-2022 Aion Technology LLC
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

import {JSONPath} from 'jsonpath-plus';
import {LinksHolder} from 'src/app/implementation/repository/links-holder';

export class SchoolSession implements LinksHolder<SchoolSession> {

  id: string;
  startDate: Date;
  endDate: Date;
  label: string;
  isCurrent: boolean;
  links: {
    self: [
      { href: string; }
    ]
  };

  constructor(json?: any) {
    this.id = json?.id;
    this.startDate = json?.startDate;
    this.endDate = json?.endDate;
    this.label = json?.label;
    this.isCurrent = json?.isCurrent;
    this.links = json?.links;
  }

  get labelWithCurrent(): string {
    let label = this.label;
    label += this.isCurrent ? ' (current)' : '';
    return label;
  }

  clearLinks(): SchoolSession {
    this.links = undefined;
    return this;
  }

  getSelfLink(): string {
    const href = JSONPath({path: '$.links[?(@.rel == "self")].href', json: this});
    if (Array.isArray(href) && href.length === 1) {
      const self = href[0];
      return self;
    }
    throw new Error('No self link found');
  }

}
