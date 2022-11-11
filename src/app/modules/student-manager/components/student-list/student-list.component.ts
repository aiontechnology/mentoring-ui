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
import {EnableableCommand} from '../../../../implementation/command/enableable-command';
import {MenuCommand} from '../../../../implementation/command/menu-command';
import {ListComponent} from '../../../../implementation/component/list-component';
import {CommandArray} from '../../../../implementation/component/menu-registering-component';
import {equalsById} from '../../../../implementation/functions/comparison';
import {Contact} from '../../../../implementation/models/contact/contact';
import {Student} from '../../../../implementation/models/student/student';
import {MultiItemCache} from '../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {
  SCHOOL_SESSION_COLLECTION_CACHE,
  SCHOOL_SESSION_INSTANCE_CACHE
} from '../../../../providers/global/global-school-session-providers-factory';
import {STUDENT_INSTANCE_CACHE} from '../../../../providers/global/global-student-providers-factory';
import {STUDENT_TABLE_CACHE} from '../../providers/student-providers-factory';
import {STUDENT_LIST_MENU} from '../../student-manager.module';

@Component({
  selector: 'ms-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent extends ListComponent<Student> implements OnInit, OnDestroy {
  columns = ['select', 'firstName', 'lastName', 'studentId', 'grade', 'teacher', 'actualTime', 'contacts']
  compareSessions = equalsById

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(STUDENT_LIST_MENU) menuCommands: CommandArray,
    @Inject(STUDENT_TABLE_CACHE) tableCache: TableCache<Student>,
    @Inject(STUDENT_INSTANCE_CACHE) studentInstanceCache: SingleItemCache<Student>,
    // other
    @Inject(SCHOOL_SESSION_COLLECTION_CACHE) public schoolSessionCollectionCache: MultiItemCache<SchoolSession>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) public schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
  ) {
    super(menuState, menuCommands, tableCache, studentInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.menuState.reset()
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
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

  protected override registerMenus(menuState: MenuStateService, menuCommands: CommandArray) {
    menuCommands.forEach(command => {
      const c: MenuCommand = command.factory(false);
      c.enableIf(() => this.schoolSessionInstanceCache.item?.isCurrent)
      menuState.add(c)
    })
  }
}
