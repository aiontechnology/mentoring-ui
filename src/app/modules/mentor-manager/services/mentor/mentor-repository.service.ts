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
import { log } from 'src/app/shared/logging-decorator';
import { Mentor } from '../../models/mentor/mentor';
import { Observable } from 'rxjs';

@Injectable()
export class MentorRepositoryService extends BaseRepository<Mentor> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/mentors', http);
  }

  get mentors(): Observable<Mentor[]>{
    return this.items;
  }

  createMentor(schoolId: string, mentor: Mentor): Promise<Mentor> {
    return super.create(this.buildUri(schoolId), mentor);
  }

  @log
  readAllMentors(schoolId: string): void {
    super.readAll(this.buildUri(schoolId));
  }

  readOneMentor(schoolId: string, mentorId: string): void {
    super.readOne(`${this.buildUri(schoolId)}/${mentorId}`);
  }

  updateMentor(mentor: Mentor): Promise<Mentor> {
    return super.update(this.uriBase, mentor);
  }

  deleteMentors(mentors: Mentor[]): Promise<void> {
    return super.delete(mentors);
  }

  getMentorById(id: string): Mentor {
    return this.getById(id);
  }

  protected fromJSON(json: any): Mentor {
    return new Mentor(json);
  }

  protected newItem(): Mentor {
    return new Mentor();
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
