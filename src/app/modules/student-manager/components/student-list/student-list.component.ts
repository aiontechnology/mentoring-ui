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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {grades} from 'src/app/implementation/constants/grades';
import {SchoolSession} from 'src/app/implementation/models/school/schoolsession';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {AbstractListComponent} from '../../../../implementation/component/abstract-list-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {SchoolUriSupplier} from '../../../../implementation/data/school-uri-supplier';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {Contact} from '../../../../implementation/models/contact/contact';
import {Student} from '../../../../implementation/models/student/student';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {SCHOOL_SESSION_DATA_SOURCE, SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../providers/global-school-session-providers-factory';
import {STUDENT_INSTANCE_CACHE, STUDENT_URI_SUPPLIER} from '../../../../providers/global-student-providers-factory';
import {STUDENT_TABLE_CACHE} from '../../providers/student-providers-factory';
import {STUDENT_LIST_MENU} from '../../student-manager.module';

@Component({
  selector: 'ms-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent extends AbstractListComponent<Student> implements OnInit, OnDestroy {
  columns = ['select', 'firstName', 'lastName', 'studentId', 'grade', 'teacher', 'actualTime', 'contacts']

  schoolSessions$: Promise<SchoolSession[]>;

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(STUDENT_LIST_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    @Inject(STUDENT_TABLE_CACHE) tableCache: TableCache<Student>,
    @Inject(STUDENT_INSTANCE_CACHE) studentInstanceCache: SingleItemCache<Student>,
    // other
    @Inject(STUDENT_URI_SUPPLIER) private studentUriSupplier: SchoolUriSupplier,
    @Inject(SCHOOL_SESSION_DATA_SOURCE) private schoolSessionDataSource: DataSource<SchoolSession>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
  ) {
    super(menuState, menuCommands, tableCache, studentInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.menuState.clear()
    this.studentUriSupplier.observable.subscribe(this.loadTableCache)
    this.init()
      .then(() => console.log('Initialization complete', this))
      .then(this.loadSchoolSessions)
  }

  ngOnDestroy(): void {
    this.destroy()
      .then(() => console.log('Destruction complete', this))
  }

  displayContact(contact: Contact): string {
    const name = contact.firstName + ' ' + contact.lastName;
    let contactInfo = contact.phone ?? '';
    if (contact.email !== null) {
      contactInfo += contactInfo ? ', ' + contact.email : contact.email;
    }
    return name + ': ' + contactInfo;
  }

  studentGrade(student: Student): string {
    return grades[student.grade].valueView;
  }

  updateSession() {
    this.loadTableCache();
  }

  protected override preTableCacheLoad = async (): Promise<void> => {
    const that = this
    return new Promise(resolve => {
      if (!that.schoolSessionInstanceCache.isEmpty) {
        that.studentUriSupplier.withParameter('session', this.schoolSessionInstanceCache.item.id)
      }
      resolve()
    })
  }

  private loadSchoolSessions = (): void => {
    this.schoolSessionDataSource.reset()
    this.schoolSessions$ = this.schoolSessionDataSource.allValues()
      .then(schoolSessions => {
        if (this.schoolSessionInstanceCache.isEmpty) {
          schoolSessions.forEach(schoolSession => {
            if (schoolSession.isCurrent) {
              this.schoolSessionInstanceCache.item = schoolSession;
            }
          });
        }
        return schoolSessions;
      });
  }
}
