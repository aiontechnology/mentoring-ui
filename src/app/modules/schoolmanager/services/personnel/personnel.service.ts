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
import { HttpClient } from '@angular/common/http';
import { Personnel } from '../../models/personnel/personnel';

@Injectable()
export class PersonnelService {

  private personnelUri = environment.apiUri + '/api/v1/schools/{id}/personnel';

  private _personnel: BehaviorSubject<Personnel[]>;

  private dataStore: {
    personnel: Personnel[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { personnel: [] };
    this._personnel = new BehaviorSubject<Personnel[]>([]);
  }

  get personnel(): Observable<Personnel[]> {
    return this._personnel;
  }

  addPersonnel(schoolId: string, personnel: Personnel): Promise<Personnel> {
    const uri = this.buildUri(schoolId);
    console.log('POST ', uri);
    return new Promise((resolver, reject) => {
      console.log('Adding personnel:', schoolId, personnel);
      this.http.post(uri, personnel)
        .subscribe(data => {
          const p = data as Personnel;
          this.dataStore.personnel.push(p);
          this.publishPersonnel();
          resolver(p);
        }, error => {
          console.error('Failed to create personnel');
        });
    });
  }

  loadAll(schoolId: string): void {
    const uri = this.buildUri(schoolId);
    console.log('GET ', uri);
    this.http.get<any>(uri)
      .subscribe(data => {
        this.dataStore.personnel = data?._embedded?.personnelModelList || [];
        this.logCache();
        this.publishPersonnel();
      });
  }

  removePersonnel(personnel: Personnel[]) {
    personnel.forEach(p => {
      this.http.delete(p._links.self[0].href, {})
        .subscribe(data => {
          const index: number = this.dataStore.personnel.indexOf(p);
          if (index !== -1) {
            this.dataStore.personnel.splice(index, 1);
          }
          this.publishPersonnel();
        });
    });
  }

  private publishPersonnel(): void {
    this._personnel.next(Object.assign({}, this.dataStore).personnel);
  }

  private buildUri(schoolId: string) {
    return this.personnelUri.replace('{id}', schoolId);
  }

  private logCache(): void {
    for (const personnel of this.dataStore.personnel) {
      console.log('Cache entry (personnel): ', personnel);
    }
  }

}
