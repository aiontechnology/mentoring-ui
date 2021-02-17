/**
 * Copyright 2020 - 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { School } from '../../models/school/school';

@Injectable()
export class SchoolRepositoryService extends BaseRepository<School> {

  constructor(http: HttpClient) {
    super('/api/v1/schools', http);
  }

  get schools(): Observable<School[]> {
    return this.items;
  }

  createSchool(school: School): Promise<School> {
    return super.create(this.uriBase, school);
  }

  readAllSchools(): void {
    return super.readAll(this.uriBase);
  }

  readOneSchool(id: string): void {
    return super.readOne(`${this.uriBase}/${id}`);
  }

  getSchoolById(id: string): School {
    return super.getById(id);
  }

  updateSchool(school: School): Promise<School> {
    return super.update(this.uriBase, school);
  }

  deleteSchools(schools: School[]) {
    return super.delete(schools);
  }

  protected fromJSON(json: any): School {
    return new School(json);
  }

  protected newItem(): School {
    return new School();
  }

}
