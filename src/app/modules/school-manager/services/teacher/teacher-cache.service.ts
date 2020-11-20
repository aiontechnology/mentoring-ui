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
import { Teacher } from '../../models/teacher/teacher';
import { DatasourceManager } from '../../../shared/services/datasource-manager';
import { TeacherRepositoryService } from './teacher-repository.service';

@Injectable()
export class TeacherCacheService extends DatasourceManager<Teacher>  {

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(private teacherService: TeacherRepositoryService) {
    super();
  }

  establishDatasource(schoolId: string): void {
    this.elements = this.teacherService.items;
    this.teacherService.readAllTeachers(schoolId);
    this.elements.subscribe(t => {
      this.dataSource.data = t;
    });
  }

  protected doRemoveItem(items: Teacher[]): void {
    this.teacherService.deleteTeachers(items);
  }

}
