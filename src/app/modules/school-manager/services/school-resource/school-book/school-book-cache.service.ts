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
import { SchoolBookRepositoryService } from './school-book-repository.service';
import { DatasourceManager } from 'src/app/modules/shared/services/datasource-manager/datasource-manager';
import { Book } from 'src/app/modules/shared/models/book/book';
import { tap } from 'rxjs/operators';

@Injectable()
export class SchoolBookCacheService extends DatasourceManager<Book> {

  constructor(private schoolBookService: SchoolBookRepositoryService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.schoolBookService.readAllSchoolBooks(schoolId);
    this.dataSource.data$ = this.schoolBookService.schoolBooks
      .pipe(tap(() => console.log('Creating new school book datasource')));
  }

}
