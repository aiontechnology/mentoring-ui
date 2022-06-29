/*
 * Copyright 2022 Aion Technology LLC
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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { log } from 'src/app/shared/logging-decorator';
import { SchoolSession } from '../../models/school/schoolsession';
import { DatasourceManagerRemovable } from '../datasource-manager/datasource-manager-removable';
import { SchoolSessionRepositoryService } from './school-session-repository.service';

@Injectable()
export class SchoolSessionCacheService extends DatasourceManagerRemovable<SchoolSession> {

  private isLoading$: BehaviorSubject<boolean>;

  constructor(private schoolSessionService: SchoolSessionRepositoryService) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
    console.log('Constructing a new SchoolSessionCacheService instance');
  }

  /**
   * Load backend data to table.
   */
   @log
   establishDatasource(schoolId: string): void {
     this.schoolSessionService.readAllSchoolSessions(schoolId);
     this.dataSource.data$ = this.schoolSessionService.items.pipe(
       tap(() => {
         this.isLoading$.next(false);
         console.log('Creating new school session datasource');
       })
     );
   }

   get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  protected doRemoveItem(items: SchoolSession[]): Promise<void> {
    return this.schoolSessionService.deleteSchoolSessions(items);
  }

}
