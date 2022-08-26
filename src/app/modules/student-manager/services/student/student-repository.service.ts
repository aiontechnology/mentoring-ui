/*
 * Copyright 2020-2022 Aion Technology LLC
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
import {Injectable} from '@angular/core';
import {BaseRepository} from 'src/app/implementation/repository/base-repository';
import {log} from 'src/app/shared/logging-decorator';
import {Student} from '../../models/student/student';
import {StudentInbound} from '../../models/student-inbound/student-inbound';
import {StudentOutbound} from '../../models/student-outbound/student-outbound';
import {Observable} from 'rxjs';

@Injectable()
export class StudentRepositoryService extends BaseRepository<Student> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/students', http);
  }

  get students(): Observable<StudentInbound[]> {
    return this.items;
  }

  createStudent(schoolId: string, student: StudentOutbound): Promise<StudentInbound> {
    return super.create(this.buildUri(schoolId), student);
  }

  @log
  readAllStudents(schoolId: string, sessionId: string): void {
    super.readAll(this.buildUri(schoolId, null, sessionId));
  }

  readOneStudent(schoolId: string, studentId: string, sessionId?: string): void {
    return super.readOne(this.buildUri(schoolId, studentId, sessionId));
  }

  getStudentById(id: string): StudentInbound {
    return super.getById(id);
  }

  updateStudent(student: StudentOutbound): Promise<StudentInbound> {
    return super.update(this.uriBase, student);
  }

  deleteStudents(students: StudentInbound[]): Promise<void> {
    return super.delete(students);
  }

  protected fromJSON(json: any): StudentInbound {
    return new StudentInbound(json);
  }

  protected newItem(): StudentOutbound {
    return new StudentOutbound();
  }

  private buildUri(schoolId: string, studentId?: string, sessionId?: string) {
    let uri = this.uriBase.replace('{id}', schoolId);
    if (studentId !== undefined && studentId != null) {
      uri += `/${studentId}`;
    }
    if (sessionId !== undefined && sessionId != null) {
      uri += `?session=${sessionId}`;
    }
    return uri;
  }

}
