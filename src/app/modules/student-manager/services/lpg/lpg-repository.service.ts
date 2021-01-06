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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { log } from 'src/app/shared/logging-decorator';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class LpgRepositoryService {

  private path: string;

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {
    this.path = '/api/v1/schools/{schoolId}/students/{studentId}/learningPathway?month={month}&year={year}';
  }

  private get uriBase() {
    return environment.lpgUri + this.path;
  }

  private buildUri(schoolId: string, studentId: string, month: string, year: string): string {
    let url = this.uriBase.replace('{schoolId}', schoolId);
    url = url.replace('{studentId}', studentId);
    url = url.replace('{month}', month);
    return url.replace('{year}', year);
  }

  @log
  getLpg(schoolId: string, studentId: string, month: string, year: string): Observable<Blob> {

    let url = this.buildUri(schoolId, studentId, month, year);

    const options = {
      headers: new HttpHeaders().set('Accept', 'application/pdf'),
      observe: 'body' as const,
      responseType: 'blob' as const
    };

    console.log('Generating learning pathway for student:', url);
    return this.http.get(url, options)
      .pipe(
        tap(
        data => console.log('Learning pathway generated successfully'),
        error => {
          console.log('failed to get learning pathway', error);
          this.snackBar.open(error?.message, '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        })
      );

  }

}
