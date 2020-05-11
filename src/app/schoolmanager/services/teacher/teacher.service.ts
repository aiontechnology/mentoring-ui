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
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Teacher } from '../../models/teacher/teacher';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TeacherService {

  private teacherUri = environment.apiUri + '/api/v1/schools/{id}/teachers';

  private _teachers: BehaviorSubject<Teacher[]>;

  private dataStore: {
    teachers: Teacher[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { teachers: [] };
    this._teachers = new BehaviorSubject<Teacher[]>([]);
  }

  get teachers(): Observable<Teacher[]> {
    return this._teachers;
  }

  addTeacher(schoolId: string, teacher: Teacher): Promise<Teacher> {
    const uri = this.buildUri(schoolId);
    console.log('POST ', uri);
    return new Promise((resolver, reject) => {
      console.log('Adding teacher:', schoolId, teacher);
      this.http.post(uri, teacher)
        .subscribe(data => {
          const t = data as Teacher;
          this.dataStore.teachers.push(t);
          this.publishTeachers();
          resolver(t);
        }, error => {
          console.error('Failed to create teacher');
        });
    });
  }

  loadAll(schoolId: string): void {
    const uri = this.buildUri(schoolId);
    console.log('GET ', uri);
    this.http.get<any>(uri)
      .subscribe(data => {
        this.dataStore.teachers = data?._embedded?.teacherModelList || [];
        this.logCache();
        this.publishTeachers();
      });
  }

  private publishTeachers(): void {
    this._teachers.next(Object.assign({}, this.dataStore).teachers);
  }

  private buildUri(schoolId: string) {
    return this.teacherUri.replace('{id}', schoolId);
  }

  private logCache(): void {
    for (const teacher of this.dataStore.teachers) {
      console.log('Cache entry (teacher): ', teacher);
    }
  }

}
