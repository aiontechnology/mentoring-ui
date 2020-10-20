import { HttpClient, HttpClientModule } from '@angular/common/http';
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

import { Injectable } from '@angular/core';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { log } from 'src/app/shared/logging-decorator';
import { Student } from '../../models/student/student';

@Injectable()
export class StudentRepositoryService extends BaseRepository<Student> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/students', http);
  }

  @log
  readAllStudents(schoolId: string): void {
    super.readAll(this.buildUri(schoolId));
  }


  deleteStudents(students: Student[]): void {
    super.delete(students);
  }

  protected fromJSON(json: any): Student {
    return new Student(json);
  }

  protected newItem(): Student {
    return new Student();
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
