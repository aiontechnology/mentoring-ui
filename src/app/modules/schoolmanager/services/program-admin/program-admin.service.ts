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
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProgramAdmin } from '../../models/program-admin/program-admin';

@Injectable()
export class ProgramAdminService {

  private teacherUri = environment.apiUri + '/api/v1/schools/{id}/programAdmins';

  private _programAdmins: BehaviorSubject<ProgramAdmin[]>;

  private dataStore: {
    programAdmins: ProgramAdmin[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { programAdmins: [] };
    this._programAdmins = new BehaviorSubject<ProgramAdmin[]>([]);
  }

  get programAdmins(): Observable<ProgramAdmin[]> {
    return this._programAdmins;
  }

  addProgramAdmin(schoolId: string, programAdmin: ProgramAdmin  ): Promise<ProgramAdmin> {
    const uri = this.buildUri(schoolId);
    console.log('POST ', uri);
    return new Promise((resolver, reject) => {
      console.log('Adding program admin:', schoolId, programAdmin);
      this.http.post(uri, programAdmin)
        .subscribe(data => {
          const t = data as ProgramAdmin;
          this.dataStore.programAdmins.push(t);
          this.publishProgramAdmins();
          resolver(t);
        }, error => {
          console.error('Failed to create program admin');
        });
    });
  }

  loadAll(schoolId: string): void {
    const uri = this.buildUri(schoolId);
    console.log('GET ', uri);
    this.http.get<any>(uri)
      .subscribe(data => {
        this.dataStore.programAdmins = data?._embedded?.programAdminModelList || [];
        this.logCache();
        this.publishProgramAdmins();
      });
  }

  removeProgramAdmins(programAdmins: ProgramAdmin[]) {
    programAdmins.forEach(programAdmin => {
      this.http.delete(programAdmin._links.self[0].href, {})
        .subscribe(data => {
          const index: number = this.dataStore.programAdmins.indexOf(programAdmin);
          if (index !== -1) {
            this.dataStore.programAdmins.splice(index, 1);
          }
          this.publishProgramAdmins();
        });
    });
  }

  private publishProgramAdmins(): void {
    this._programAdmins.next(Object.assign({}, this.dataStore).programAdmins);
  }

  private buildUri(schoolId: string) {
    return this.teacherUri.replace('{id}', schoolId);
  }

  private logCache(): void {
    for (const programAdmin of this.dataStore.programAdmins) {
      console.log('Cache entry (programAdmim): ', programAdmin);
    }
  }

}
