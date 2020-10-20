/**
 * Copyright 2020 Aion Technology LLC
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

import { LinksHolder } from 'src/app/implementation/repository/links-holder';
import { Teacher } from 'src/app/modules/school-manager/models/teacher/teacher';

interface EmergencyContacts {
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  workPhone: string;
  cellPhone: string;
}

export class Student implements LinksHolder<Student> {

  firstName: string;
  lastName: string;
  grade: string;
  preferredTime: string;
  mediaReleaseSigned: boolean;
  teacher: Teacher;
  behaviors: string[];
  leadershipSkills: string[];
  leadershipTraits: string[];
  emergencyContacts: EmergencyContacts[];
  location: string;
  _links: {
      self: [
          { href: string; }
      ]
  };

  constructor(json?: any) {
    this.firstName = json?.firstName;
    this.lastName = json?.lastName;
    this.grade = json?.grade;
    this.preferredTime = json?.preferredTime;
    this.mediaReleaseSigned = json?.mediaReleaseSigned;
    this.teacher = json?.teacher;
    this.behaviors = json?.behaviors;
    this.leadershipSkills = json?.leadershipSkills;
    this.leadershipTraits = json?.leadershipTraits;
    this.emergencyContacts = json?.emergencyContacts;
    this.location = json?.location;
  }

  clearLinks(): Student {
    this._links = undefined;
    return this;
  }

  getSelfLink(): string {
    return this._links?.self[0]?.href;
  }

}
