/**
 * Copyright 2021-2022 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {JSONPath} from 'jsonpath-plus';

export class LinkServiceService {

  static selfLink(json: string): string {
    if (json === undefined || json === null) {
      return null;
    }

    console.log('Looking for self link in ', JSON.parse(json));
    const href = JSONPath({path: '$.links[?(@.rel == "self")].href', json: JSON.parse(json)});
    console.log('HREF: ', href);
    if (Array.isArray(href) && href.length === 1) {
      const self = href[0];
      console.log('Self link:', self);
      return self;
    }
    throw new Error('No self link found');
  }

}
