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

import {personLocations} from 'src/app/implementation/constants/locations';
import {convertEmptyStringToNull} from '../../implementation/functions/value-or-null';
import {Contact} from '../contact/contact';

export abstract class Student {
  id: string
  firstName: string
  lastName: string
  studentId: string
  grade: string
  preferredTime: string
  actualTime: string
  startDate: string
  location: string
  mediaReleaseSigned: boolean
  preBehavioralAssessment: number
  postBehavioralAssessment: number
  behaviors: string[]
  interests: string[]
  leadershipSkills: string[]
  leadershipTraits: string[]
  contacts: Contact[]
  links: {
    self: [
      { href: string }
    ]
  };

  abstract teacher: any
  abstract mentor: any

  protected constructor(json?: any) {
    this.id = convertEmptyStringToNull(json?.id)
    this.firstName = convertEmptyStringToNull(json?.firstName)
    this.lastName = convertEmptyStringToNull(json?.lastName)
    this.studentId = convertEmptyStringToNull(json?.studentId)
    this.grade = convertEmptyStringToNull(json?.grade)
    this.preferredTime = convertEmptyStringToNull(json?.preferredTime)
    this.actualTime = convertEmptyStringToNull(json?.actualTime)
    this.startDate = convertEmptyStringToNull(json?.startDate)
    this.location = convertEmptyStringToNull(json?.location)
    this.mediaReleaseSigned = json?.mediaReleaseSigned
    this.preBehavioralAssessment = json?.preBehavioralAssessment
    this.postBehavioralAssessment = json?.postBehavioralAssessment
    this.behaviors = json?.behaviors || []
    this.interests = json?.interests || []
    this.leadershipSkills = json?.leadershipSkills || []
    this.leadershipTraits = json?.leadershipTraits || []

    this.contacts = []
    json?.contacts?.forEach(contact => {
      this.contacts.push(new Contact(contact))
    });

    this.links = json?.links
  }

  get displayLocation(): string {
    return personLocations[this.location] ?? ''
  }

  /**
   * Calculate the teacher's name.
   */
  get teacherName(): string {
    const firstName = this.teacher?.teacher?.firstName ?? ''
    const lastName = this.teacher?.teacher?.lastName ?? ''
    let fullName = ''
    fullName += firstName ?? ''
    fullName += (firstName && lastName) ? ' ' : ''
    fullName += lastName ?? ''
    return fullName
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
