/**
 * Copyright 2020 Aion Technology LLC
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { School } from '../models/school';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SchoolService {

  private schoolUrl = 'http://localhost:8080/api/v1/schools';

  private _schools: BehaviorSubject<School[]>;

  private dataStore: {
    schools: School[]
  };

  constructor(private http: HttpClient) {
    this.dataStore = { schools: [] };
    this._schools = new BehaviorSubject<School[]>([]);
  }

  get schools(): Observable<School[]> {
    return this._schools.asObservable();
  }

  addSchool(school: School): Promise<School> {
    return new Promise((resolver, reject) => {
      this.http.post(this.schoolUrl, school)
        .subscribe(data => {
          const s = data as School;
          this.dataStore.schools.push(s);
          this._schools.next(Object.assign({}, this.dataStore).schools);
          resolver(s);
        }, error => {
          console.log('Failed to create school');
        });
    });
  }

  loadAll() {
    return this.http.get<School[]>(this.schoolUrl)
      .subscribe(data => {
        console.log(data);
        this.dataStore.schools = data;
        this._schools.next(Object.assign({}, this.dataStore).schools);
      }, error => {
        console.log('Failed to fetch schools');
      });

  }
}
