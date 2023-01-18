/*
 * Copyright 2020-2023 Aion Technology LLC
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

import {grades} from '../../implementation/constants/grades';
import {convertEmptyStringToNull} from '../../implementation/functions/value-or-null';
import {LinkService} from '../../modules/shared/services/link-service/link.service';

/**
 * Model class the represents a teacher.
 * @author Whitney Hunter
 */
export class Teacher {
  firstName: string
  lastName: string
  email: string
  cellPhone: string
  grade1: number
  grade2: number
  links: {
    self: [
      { href: string }
    ]
  };

  constructor(json?: any) {
    this.firstName = convertEmptyStringToNull(json?.firstName)
    this.lastName = convertEmptyStringToNull(json?.lastName)
    this.email = convertEmptyStringToNull(json?.email)
    this.cellPhone = convertEmptyStringToNull(json?.cellPhone)
    this.grade1 = json?.grade1 !== null ? Number(json?.grade1) : null
    this.grade2 = json?.grade2 !== null ? Number(json?.grade2) : null
    this.links = json?.links
  }

  get grades(): string {
    const part1 = grades[this.grade1]?.valueView
    const part2 = this.grade2 !== null ? ', ' + grades[this.grade2].valueView : ''
    return part1 + part2
  }

  get selfLink(): string {
    return LinkService.selfLink(this)
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
