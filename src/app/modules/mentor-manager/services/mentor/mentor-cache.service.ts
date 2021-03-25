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
import { Mentor } from '../../models/mentor/mentor';
import { MentorRepositoryService } from './mentor-repository.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class MentorCacheService extends DatasourceManagerRemovable<Mentor> {

  constructor(private mentorService: MentorRepositoryService) {
    super();
  }

  @log
  establishDatasource(schoolId: string): void {
    this.mentorService.readAllMentors(schoolId);
    this.dataSource.data$ = this.mentorService.items.pipe(
      tap(() => console.log('Creating new mentor datasource'))
    );
  }

  protected doRemoveItem(items: Mentor[]): Promise<void> {
    return this.mentorService.deleteMentors(items);
  }

}
