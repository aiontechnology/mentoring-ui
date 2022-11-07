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

import {LinkService} from '../../modules/shared/services/link-service/link.service';

export function equalsById(obj1: any, obj2: any): boolean {
  const result = (!obj1?.id || !obj2?.id)
    ? false
    : obj1.id === obj2.id
  return result
}

export function equalsBySelfLink(obj1: any, obj2: any): boolean {
  const selfLink1 = LinkService.selfLink(obj1)
  const selfLink2 = LinkService.selfLink(obj2)
  const result = (!selfLink1 || !selfLink2)
    ? false
    : selfLink1 === selfLink2
  return result
}
