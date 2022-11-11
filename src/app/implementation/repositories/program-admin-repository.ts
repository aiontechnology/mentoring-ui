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

import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {ProgramAdmin} from '../models/program-admin/program-admin';
import {PROGRAM_ADMIN_URI_SUPPLIER} from '../../providers/global/global-program-admin-providers-factory';
import {Repository} from '../data/repository';
import {UriSupplier} from '../data/uri-supplier';

@Injectable()
export class ProgramAdminRepository extends Repository<ProgramAdmin> {

  constructor(http: HttpClient,
              @Inject(PROGRAM_ADMIN_URI_SUPPLIER) uriSupplier: UriSupplier) {
    super(http, uriSupplier);
  }

  protected override toModel = (value: any): ProgramAdmin => {
    return new ProgramAdmin(value);
  }

}
