/**
 * Copyright 2021 Aion Technology LLC
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
import { DatasourceManager } from 'src/app/modules/shared/services/datasource-manager/datasource-manager';
import { Book } from 'src/app/modules/shared/models/book/book';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SchoolBookRepositoryService } from './school-book-repository.service';

@Injectable()
export class SchoolBookCacheService extends DatasourceManager<Book> {

  private isLoading$: BehaviorSubject<boolean>;

  constructor(private schoolBookService: SchoolBookRepositoryService) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  establishDatasource(schoolId: string): void {
    this.schoolBookService.readAllSchoolBooks(schoolId);
    this.dataSource.data$ = this.schoolBookService.schoolBooks
      .pipe(tap(() => {
        this.isLoading$.next(false);
        console.log('Creating new school book datasource');
      })
    );
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

}
