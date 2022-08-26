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

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {log} from 'src/app/shared/logging-decorator';
import {environment} from 'src/environments/environment';

@Injectable()
export class LpgRepositoryService {

  private path: string;
  private isLoading$: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.path = '/api/v1/schools/{schoolId}/students/{studentId}/learningPathway?month={month}&year={year}';
    this.isLoading$ = new BehaviorSubject(false);
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  private get uriBase() {
    return environment.lpgUri + this.path;
  }

  @log
  getLpg(schoolId: string, studentId: string, month: string, year: string): Observable<Blob> {

    this.isLoading$.next(true);
    const url = this.buildUri(schoolId, studentId, month, year);

    const options = {
      headers: new HttpHeaders().set('Accept', 'application/pdf'),
      observe: 'body' as const,
      responseType: 'blob' as const
    };

    return this.http.get(url, options)
      .pipe(
        tap(
          () => {
            this.isLoading$.next(false);
          })
      );

  }

  private buildUri(schoolId: string, studentId: string, month: string, year: string): string {
    let url = this.uriBase.replace('{schoolId}', schoolId);
    url = url.replace('{studentId}', studentId);
    url = url.replace('{month}', month);
    return url.replace('{year}', year);
  }

}
