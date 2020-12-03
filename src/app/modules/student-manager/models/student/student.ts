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
import { Contact } from '../contact/contact';
import { Teacher } from 'src/app/modules/school-manager/models/teacher/teacher';

export abstract class Student implements LinksHolder<Student> {

  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  preferredTime: string;
  location: string;
  mediaReleaseSigned: boolean;
  allergyInfo: string;
  behaviors: string[];
  interests: string[];
  leadershipSkills: string[];
  leadershipTraits: string[];
  contacts: Contact[];
  _links: {
      self: [
          { href: string; }
      ]
  };

  abstract teacher: any;
  abstract mentor: any;

  constructor(json?: any) {
    this.id = json?.id;
    this.firstName = json?.firstName;
    this.lastName = json?.lastName;
    this.grade = json?.grade;
    this.preferredTime = json?.preferredTime;
    this.location = json?.location;
    this.mediaReleaseSigned = json?.mediaReleaseSigned;
    this.allergyInfo = json?.allergyInfo;
    this.behaviors = json?.behaviors;
    this.interests = json?.interests;
    this.leadershipSkills = json?.leadershipSkills;
    this.leadershipTraits = json?.leadershipTraits;

    this.contacts = [];
    json?.contacts.forEach(contact => {
      this.contacts.push(new Contact(contact));
    });

    this._links = json?._links;
  }

  clearLinks(): Student {
    this._links = undefined;
    return this;
  }

  getSelfLink(): string {
    return this._links?.self[0]?.href;
  }

}
