/*
 * Copyright 2020-2022 Aion Technology LLC
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

import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../../implementation/command/command';
import {AbstractDetailComponent} from '../../../../../implementation/component/abstract-detail-component';
import {grades} from '../../../../../implementation/constants/grades';
import {DataSource} from '../../../../../implementation/data/data-source';
import {SchoolUriSupplier} from '../../../../../implementation/data/school-uri-supplier';
import {SingleItemCache} from '../../../../../implementation/data/single-item-cache';
import {URI} from '../../../../../implementation/data/uri-supplier';
import {StudentInbound, StudentMentorInbound} from '../../../../../implementation/models/student-inbound/student-inbound';
import {STUDENT_ID} from '../../../../../implementation/route/route-constants';
import {STUDENT_DATA_SOURCE, STUDENT_INSTANCE_CACHE, STUDENT_URI_SUPPLIER} from '../../../../../providers/global-student-providers-factory';
import {LpgRepositoryService} from '../../../services/lpg/lpg-repository.service';
import {STUDENT_DETAIL_MENU} from '../../../student-manager.module';

@Component({
  selector: 'ms-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
})
export class StudentDetailComponent extends AbstractDetailComponent implements OnInit, OnDestroy {

  isHistoric: boolean;
  studentMentor: StudentMentorInbound;

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(STUDENT_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    @Inject(STUDENT_URI_SUPPLIER) studentUriSupplier: SchoolUriSupplier,
    // other
    @Inject(STUDENT_DATA_SOURCE) private studentDataSource: DataSource<StudentInbound>,
    @Inject(STUDENT_INSTANCE_CACHE) public studentInstanceCache: SingleItemCache<StudentInbound>,
    public lpgService: LpgRepositoryService,
  ) {
    super(menuState, menuCommands, route, studentUriSupplier)
  }

  @Input() set historic(isHistoric: boolean) { this.isHistoric = isHistoric }

  get mentorFullName(): string {
    return this.studentMentor ? this.studentMentor?.mentor?.firstName + ' ' + this.studentMentor?.mentor?.lastName : '';
  }

  get studentGrade(): string {
    return grades.find(grade => grade.value === this.studentInstanceCache.item?.grade.toString())?.valueView
  }

  ngOnInit(): void {
    this.init()
      .then(() => console.log('Initialization complete', this))
  }

  ngOnDestroy(): void {
    this.destroy()
      .then(() => console.log('Destruction complete', this))
  }


  protected onUriChange = (uri: URI) => {
    this.routeParams
      .subscribe(params => {
        const studentId = params.get(STUDENT_ID)
        this.studentDataSource.oneValue(studentId)
          .then(student => {
            this.studentInstanceCache.item = student
          })
      })
  }
}
