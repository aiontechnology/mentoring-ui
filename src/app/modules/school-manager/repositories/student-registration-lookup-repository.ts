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

import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {REGISTRATION_URI_SUPPLIER} from '../../shared/shared.module';
import {StudentRegistrationLookup} from '../../../models/workflow/student-registration-lookup';
import {Repository} from '../../../implementation/data/repository';

@Injectable()
export class StudentRegistrationLookupRepository extends Repository<StudentRegistrationLookup> {

  constructor(http: HttpClient,
              @Inject(REGISTRATION_URI_SUPPLIER) uriSupplier: UriSupplier) {
    super(http, uriSupplier);
  }

  protected override toModel = (value: any): StudentRegistrationLookup => {
    return value ? StudentRegistrationLookup.of(value) : null;
  }

}
