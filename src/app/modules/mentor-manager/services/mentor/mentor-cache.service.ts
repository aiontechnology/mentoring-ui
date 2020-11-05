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
import { DatasourceManager } from 'src/app/modules/shared/services/datasource-manager';
import { log } from 'src/app/shared/logging-decorator';
import { Mentor } from '../../models/mentor/mentor';
import { MentorRepositoryService } from './mentor-repository.service';

@Injectable()
export class MentorCacheService extends DatasourceManager<Mentor>  {

  /** Binds to the filter input control. Used to clear the control when requested. */
  filterBinding: string;

  constructor(private mentorService: MentorRepositoryService) {
    super();
  }

  @log
  establishDatasource(schoolId: string): void {
    this.elements = this.mentorService.items;
    this.mentorService.readAllMentors(schoolId);
    this.elements.subscribe(t => {
      this.dataSource.data = t;
    });
  }

  /**
   * Get the value of the data source filter.
   */
  get filter() {
    return this.dataSource.filter;
  }

  protected doRemoveItem(items: Mentor[]): void {
    this.mentorService.deleteMentors(items);
  }

}
