/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

import { Resource } from '../resource/resource';

export class Game extends Resource {

  name: string;
  description: string;
  grade1: number;
  grade2: number;
  activityFocuses: string[];

  constructor(json?: any) {
    super(json);
    this.displayName = json?.name;
    this.name = json?.name;
    this.description = json?.description;
    if (json.gradeRange) {
      this.grade1 = json?.gradeRange?.grade1;
      this.grade2 = json?.gradeRange?.grade2;
    } else {
      this.grade1 = json?.grade1;
      this.grade2 = json?.grade2;
    }
    this.activityFocuses = json?.activityFocuses;
  }

}
