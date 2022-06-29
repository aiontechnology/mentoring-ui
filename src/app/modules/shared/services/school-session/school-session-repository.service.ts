/*
 * Copyright 2022-2022 Aion Technology LLC
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { SchoolSession } from '../../models/school/schoolsession';

@Injectable()
export class SchoolSessionRepositoryService extends BaseRepository<SchoolSession> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/schoolsessions', http);
  }

  get schoolSessions(): Observable<SchoolSession[]> {
    return this.items;
  }

  createSchoolSession(schoolId: string, schoolSession: SchoolSession): Promise<SchoolSession> {
    return super.create(this.buildUri(schoolId), schoolSession);
  }

  readAllSchoolSessions(schoolId: string): void {
    return super.readAll(this.buildUri(schoolId));
  }

  readOneSchoolSession(schoolId: string, id: string): void {
    return super.readOne(`${this.buildUri(schoolId)}/${id}`);
  }

  getSchoolSessionById(id: string): SchoolSession {
    return super.getById(id);
  }

  updateSchoolSession(schoolSession: SchoolSession): Promise<SchoolSession> {
    return super.update(this.uriBase, schoolSession);
  }

  deleteSchoolSessions(schoolSessions: SchoolSession[]): Promise<void> {
    return super.delete(schoolSessions);
  }

  protected fromJSON(json: any): SchoolSession {
    return new SchoolSession(json);
  }

  protected newItem(): SchoolSession {
    return new SchoolSession();
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
