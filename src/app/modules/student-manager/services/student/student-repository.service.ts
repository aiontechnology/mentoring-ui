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

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { log } from 'src/app/shared/logging-decorator';
import { Student } from '../../models/student/student';
import { StudentInbound } from '../../models/student-inbound/student-inbound';
import { StudentOutbound } from '../../models/student-outbound/student-outbound';

@Injectable()
export class StudentRepositoryService extends BaseRepository<Student> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/students', http);
  }

  createStudent(schoolId: string, student: StudentOutbound): Promise<StudentInbound> {
    return super.create(this.buildUri(schoolId), student);
  }
  
  curriedCreateStudent(schoolId: string): (student: StudentOutbound) => Promise<StudentInbound> {
    return (s: StudentOutbound) => this.createStudent(schoolId, s);
  }

  @log
  readAllStudents(schoolId: string): void {
    super.readAll(this.buildUri(schoolId));
  }

  deleteStudents(students: StudentInbound[]): void {
    super.delete(students);
  }

  protected fromJSON(json: any): StudentInbound {
    return new StudentInbound(json);
  }

  protected newItem(): StudentOutbound {
    return new StudentOutbound();
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
