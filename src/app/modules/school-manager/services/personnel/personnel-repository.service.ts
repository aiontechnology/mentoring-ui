/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { Personnel } from '../../models/personnel/personnel';

@Injectable()
export class PersonnelRepositoryService extends BaseRepository<Personnel> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/personnel', http);
  }

  createPersonnel(schoolId: string, personnel: Personnel): Promise<Personnel> {
    return super.create(this.buildUri(schoolId), personnel);
  }

  readAllPersonnel(schoolId: string): void {
    return super.readAll(this.buildUri(schoolId));
  }

  updatePersonnel(personnel: Personnel): Promise<Personnel> {
    return super.update(this.uriBase, personnel);
  }

  deletePersonnel(personnel: Personnel[]): Promise<void> {
    return super.delete(personnel);
  }

  protected fromJSON(json: any): Personnel {
    return new Personnel(json);
  }

  protected newItem(): Personnel {
    return new Personnel();
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
