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

import { Component, OnInit } from '@angular/core';
import { School } from 'src/app/modules/shared/models/school/school';
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { SchoolRepositoryService } from 'src/app/modules/shared/services/school/school-repository.service';
import { log } from 'src/app/shared/logging-decorator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ms-mentor-frame',
  templateUrl: './mentor-frame.component.html',
  styleUrls: ['./mentor-frame.component.scss']
})
export class MentorFrameComponent implements OnInit {

  schools$: Observable<School[]>;
  selected: School;

  constructor(private logger: LoggingService,
              private schoolRepository: SchoolRepositoryService) {
    this.initialize();
  }

  @log
  ngOnInit(): void {
    this.schoolRepository.readAllSchools();
    this.schools$ = this.schoolRepository.schools.pipe(
      tap(s => this.logger.log('Read schools', s))
    );
  }

  @log
  private initialize(): void {
    this.logger.log('Creating a mentor manager');
  }

}
