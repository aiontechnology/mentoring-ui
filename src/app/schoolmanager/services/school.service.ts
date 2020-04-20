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
import { environment } from 'src/environments/environment';

@Injectable()
export class SchoolService {

  private schoolsUri = environment.apiUri + '/api/v1/schools';

  private _schools: BehaviorSubject<School[]>;

  private dataStore: {
    schools: School[]
  };

  constructor(private http: HttpClient) {
    this.dataStore = { schools: [] };
    this._schools = new BehaviorSubject<School[]>([]);
  }

  get schools(): Observable<School[]> {
    return this._schools;
  }

  addSchool(school: School): Promise<School> {
    return new Promise((resolver, reject) => {
      this.http.post(this.schoolsUri, this.stripLinks(school))
        .subscribe(data => {
          const s = data as School;
          this.dataStore.schools.push(s);
          this.publishSchools();
          resolver(s);
        }, error => {
          console.error('Failed to create school');
        });
    });
  }

  updateSchool(school: School): Promise<School> {
    console.log('Updating school: ', school);
    return new Promise((resolver, reject) => {
      this.http.put(school._links.self[0].href, this.stripLinks(school))
        .subscribe(data => {
          console.log('Recieved back: ', data);
          const s = data as School;
          for (const index in this.dataStore.schools) {
            if (this.dataStore.schools[index].id === s.id) {
              console.log('Replacing school: ', this.dataStore.schools[index], s);
              this.dataStore.schools[index] = s;
              break;
            }
          }
          this.publishSchools();
          resolver(s);
        }, error => {
          console.error('Failed to update school');
        });
    });
  }

  removeSchools(schools: School[]) {
    schools.forEach(school => {
      this.http.delete(school._links.self[0].href, {})
        .subscribe(data => {
          const index: number = this.dataStore.schools.indexOf(school);
          if (index !== -1) {
            this.dataStore.schools.splice(index, 1);
          }
          this.publishSchools();
        });
    });
  }

  findById(id: string): School {
    for (const school of this.dataStore.schools) {
      if (school.id === id) {
        return school;
      }
    }
    return null;
  }

  loadAll(): void {
    this.http.get<any>(this.schoolsUri)
      .subscribe(data => {
        this.dataStore.schools = data?._embedded?.schoolModelList || [];
        this.logCache();
        this.publishSchools();
      }, error => {
        console.error('Failed to fetch schools');
      });
  }

  private publishSchools(): void {
    this._schools.next(Object.assign({}, this.dataStore).schools);
  }

  private stripLinks(school: School): School {
    const s = Object.assign({}, school);
    s._links = undefined;
    return s;
  }

  private logCache(): void {
    for (const school of this.dataStore.schools) {
      console.log('Cache entry: ', school);
    }
  }

}
