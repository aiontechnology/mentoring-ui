/*
 * Copyright 2020-2022 Aion Technology LLC
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

import {LinkService} from '../../../shared/services/link-service/link.service';

/**
 * Model class the represents a teacher.
 * @author Whitney Hunter
 */
export class Teacher {
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  grade1: number;
  grade2: number;
  links: {
    self: [
      { href: string; }
    ]
  };

  constructor(json?: any) {
    this.firstName = json?.firstName;
    this.lastName = json?.lastName;
    this.email = (json?.email === '') ? null : json?.email;
    this.cellPhone = json?.cellPhone;
    this.grade1 = Number(json?.grade1);
    this.grade2 = Number(json?.grade2);
    this.links = json?.links;
  }

  get selfLink(): string {
    return LinkService.selfLink(this);
  }
}
