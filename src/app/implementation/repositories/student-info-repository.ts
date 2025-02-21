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

import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Repository} from '@implementation/data/repository';
import {UriSupplier} from '@implementation/data/uri-supplier';
import {BaseUri} from '@models/workflow/base-uri';
import {StudentInformation} from '@models/workflow/student-information';
import {STUDENT_INFO_URI_SUPPLIER} from '@modules-shared/providers/workflow-providers-factory';

@Injectable()
export class StudentInfoRepository extends Repository<StudentInformation> {

  constructor(
    http: HttpClient,
    @Inject(STUDENT_INFO_URI_SUPPLIER) uriSupplier: UriSupplier
  ) {
    super(http, uriSupplier)
  }

  protected override toModel = (value: any): StudentInformation => {
    return value ? StudentInformation.of(value) : null
  }

}

@Injectable()
export class StudentInfoRepository2 extends Repository<BaseUri> {
  constructor(
    http: HttpClient,
    @Inject(STUDENT_INFO_URI_SUPPLIER) uriSupplier: UriSupplier
  ) {
    super(http, uriSupplier);
  }

  protected toModel = (value: any): BaseUri => {
    return value ? BaseUri.of(value) : null
  }

}
