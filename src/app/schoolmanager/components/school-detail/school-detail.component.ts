/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchoolService } from '../../services/school/school.service';
import { School } from '../../models/school/school';
import { TeacherListComponent } from '../teacher-list/teacher-list.component';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit, AfterViewInit {

  private schoolId: string;
  school: School;

  @ViewChild(TeacherListComponent) teacherList: TeacherListComponent;

  constructor(route: ActivatedRoute, private schoolService: SchoolService) {
    route.paramMap.subscribe(
      params => {
        this.schoolId = params.get('id');
      }
    );
  }

  ngOnInit(): void {
    this.schoolService.loadAll();
    this.schoolService.schools.subscribe(s => {
      this.school = this.schoolService.findById(this.schoolId);
    });
  }

  ngAfterViewInit(): void {
    this.teacherList.establishDatasource(this.schoolId);
  }

}
