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

import {Component, Inject} from '@angular/core';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {School} from '../../../../../models/school/school';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global/global-school-providers-factory';
import {STUDENT_INSTANCE_CACHE} from '../../../../../providers/global/global-student-providers-factory';
import {Student} from '../../../../../models/student/student';
import {LpgRepositoryService} from '../../../services/lpg/lpg-repository.service';

@Component({
  selector: 'ms-student-lpg',
  templateUrl: './student-lpg.component.html',
  styleUrls: ['./student-lpg.component.scss']
})
export class StudentLpgComponent {

  constructor(
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolInstanceCache: SingleItemCache<School>,
    @Inject(STUDENT_INSTANCE_CACHE) private studentInstanceCache: SingleItemCache<Student>,
    public lpgService: LpgRepositoryService,
  ) { }

  generateCurrentMonth(): void {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.generateLearningPathway(month.toString(), year.toString());
  }

  generateNextMonth(): void {
    const date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }

    this.generateLearningPathway(month.toString(), year.toString());
  }

  private generateLearningPathway(month: string, year: string): void {
    this.lpgService.getLpg(this.schoolInstanceCache.item.id, this.studentInstanceCache.item.id, month, year)
      .subscribe(pdf => {
        const url = window.URL.createObjectURL(pdf);
        window.open(url);
      });
  }
}
