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
import { Teacher } from '../../models/teacher/teacher';
import { Observable } from 'rxjs';

@Injectable()
export class TeacherRepositoryService extends BaseRepository<Teacher> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/teachers', http);
  }

  get teachers(): Observable<Teacher[]>{
    return this.items;
  }

  createTeacher(schoolId: string, teacher: Teacher): Promise<Teacher> {
    return super.create(this.buildUri(schoolId), teacher);
  }

  readAllTeachers(schoolId: string): void {
    return super.readAll(this.buildUri(schoolId));
  }

  updateTeacher(teacher: Teacher): Promise<Teacher> {
    return super.update(this.uriBase, teacher);
  }

  deleteTeachers(teachers: Teacher[]) {
    return super.delete(teachers);
  }

  protected fromJSON(json: any): Teacher {
    return new Teacher(json);
  }

  protected newItem(): Teacher {
    return new Teacher();
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
