/*
 * Copyright 2023 Aion Technology LLC
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

export class Interest {
  name: string
  links: any

  constructor(json?: any) {
    this.name = json?.name
    this.links = json?.links
  }

  static nativeOrderComparator = (item1: Interest, item2: Interest) => {
    const name1 = item1.name.toLowerCase()
    const name2 = item2.name.toLowerCase()
    if (name1 < name2) {
      return -1
    }
    if (name1 > name2) {
      return 1
    }
    return 0
  }
}
