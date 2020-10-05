import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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

import { Component, Input, OnChanges } from '@angular/core';
import { School } from 'src/app/modules/shared/models/school/school';
import { StudentCacheService } from '../../services/student/student-cache.service';

@Component({
  selector: 'ms-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnChanges {

  @Input() school: School;

  constructor(private breakpointObserver: BreakpointObserver,
              public studentCacheService: StudentCacheService) {
  }

  ngOnChanges(): void {
    if (this.school !== undefined && this.school !== null) {
      this.studentCacheService.establishDatasource(this.school.id);
    }
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'firstName'];
    } else {
      return ['select', 'firstName', 'lastName'];
    }
  }

}
