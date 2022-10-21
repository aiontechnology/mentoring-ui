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

import { personLocations } from 'src/app/implementation/constants/locations';
import { LinkService } from 'src/app/modules/shared/services/link-service/link.service';

export class Mentor {

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  availability: string;
  mediaReleaseSigned: boolean;
  backgroundCheckCompleted: boolean;
  location: string;
  links: {
    self: [
      { href: string; }
    ]
  };

  constructor(json?: any) {
    this.id = json?.id;
    this.firstName = json?.firstName;
    this.lastName = json?.lastName;
    this.email = (json?.email === '') ? null : json?.email;
    this.cellPhone = json?.cellPhone;
    this.availability = json?.availability;
    this.mediaReleaseSigned = json?.mediaReleaseSigned;
    this.backgroundCheckCompleted = json?.backgroundCheckCompleted;
    this.location = json?.location;
    this.links = json?.links;
  }

  clearLinks(): Mentor {
    this.links = undefined;
    return this;
  }

  getSelfLink(): string {
    return LinkService.selfLink(this);
  }

  get displayLocation(): string {
    return personLocations[this.location] ?? '';
  }

}
