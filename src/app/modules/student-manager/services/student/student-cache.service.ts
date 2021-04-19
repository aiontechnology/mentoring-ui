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

import { Injectable } from '@angular/core';
import { DatasourceManagerRemovable } from 'src/app/modules/shared/services/datasource-manager/datasource-manager-removable';
import { log } from 'src/app/shared/logging-decorator';
import { Student } from '../../models/student/student';
import { StudentRepositoryService } from './student-repository.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class StudentCacheService extends DatasourceManagerRemovable<Student>  {

  private isLoading$: BehaviorSubject<boolean>;

  constructor(private studentService: StudentRepositoryService) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  @log
  establishDatasource(schoolId: string): void {
    this.studentService.readAllStudents(schoolId);
    this.dataSource.data$ = this.studentService.items.pipe(
      tap(() => {
        this.isLoading$.next(false);
        console.log('Creating new student datasource');
      })
    );
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  protected doRemoveItem(items: Student[]): Promise<void> {
    return this.studentService.deleteStudents(items);
  }

}
