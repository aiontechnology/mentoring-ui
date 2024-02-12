/*
 * Copyright 2020-2024 Aion Technology LLC
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

import {convertEmptyStringToNull} from '../../implementation/functions/value-or-null';
import {Address} from '../address/address';
import {SchoolSession} from './schoolsession';

export class School {
  id: string
  initialSessionLabel: string
  name: string
  address: Address
  phone: string
  district: string
  isPrivate: boolean
  emailTag: string
  currentSession: SchoolSession
  links: {
    self: [
      { href: string }
    ]
  };

  constructor(json?: any) {
    this.id = convertEmptyStringToNull(json?.id)
    this.initialSessionLabel = convertEmptyStringToNull(json?.initialSessionLabel)
    this.name = convertEmptyStringToNull(json?.name)
    this.address = new Address(json?.address)
    this.phone = convertEmptyStringToNull(json?.phone)
    this.district = convertEmptyStringToNull(json?.district)
    this.isPrivate = json?.isPrivate
    this.emailTag = json?.emailTag
    this.currentSession = new SchoolSession(json?.currentSession)
    this.links = json?.links
  }
}
