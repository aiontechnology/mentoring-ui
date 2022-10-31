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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../../implementation/command/command';
import {CommandArray} from '../../../../../implementation/component/menu-registering-component';
import {SchoolWatchingDetailComponent} from '../../../../../implementation/component/school-watching-detail-component';
import {grades} from '../../../../../implementation/constants/grades';
import {DataSource} from '../../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {School} from '../../../../../implementation/models/school/school';
import {SchoolSession} from '../../../../../implementation/models/school/schoolsession';
import {StudentInbound, StudentMentorInbound} from '../../../../../implementation/models/student-inbound/student-inbound';
import {Student} from '../../../../../implementation/models/student/student';
import {NavigationService} from '../../../../../implementation/route/navigation.service';
import {RouteElementWatcher} from '../../../../../implementation/route/route-element-watcher.service';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../../providers/global-school-session-providers-factory';
import {
  STUDENT_DATA_SOURCE,
  STUDENT_INSTANCE_CACHE,
  STUDENT_ROUTE_WATCHER
} from '../../../../../providers/global-student-providers-factory';
import {STUDENT_DETAIL_MENU} from '../../../student-manager.module';

@Component({
  selector: 'ms-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
})
export class StudentDetailComponent extends SchoolWatchingDetailComponent implements OnInit, OnDestroy {
  studentMentor: StudentMentorInbound;
  private subscriptions: Subscription[] = []

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(STUDENT_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    navService: NavigationService,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    // other
    @Inject(STUDENT_DATA_SOURCE) private studentDataSource: DataSource<StudentInbound>,
    @Inject(STUDENT_INSTANCE_CACHE) public studentInstanceCache: SingleItemCache<StudentInbound>,
    @Inject(STUDENT_ROUTE_WATCHER) private studentRouteWatcher: RouteElementWatcher<Student>,
    private router: Router,
  ) {
    super(menuState, menuCommands, route, schoolInstanceCache, schoolSessionInstanceCache, navService)
  }

  get mentorFullName(): string {
    return this.studentMentor ? this.studentMentor?.mentor?.firstName + ' ' + this.studentMentor?.mentor?.lastName : '';
  }

  get studentGrade(): string {
    return grades.find(grade => grade.value === this.studentInstanceCache.item?.grade.toString())?.valueView
  }

  ngOnInit(): void {
    this.init()
    this.subscriptions.push(this.studentRouteWatcher.watch(this.route))
  }

  ngOnDestroy(): void {
    this.destroy()
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  protected registerMenus(menuState: MenuStateService, menuCommands: CommandArray) {
    menuCommands.forEach(command => {
      const c: Command = command.factory(false);
      c.disableFunction = () => !this.schoolSessionInstanceCache.item?.isCurrent || false
      menuState.add(c)
    })
  }

  protected doHandleBackButton = (navService: NavigationService): void =>
    navService.push({routeSpec: ['/studentmanager', 'schools', this.schoolInstanceCache.item.id], fragment: undefined})

  protected onSchoolChange(school: School) {
    this.router.navigate(['studentmanager', 'schools', school.id])
  }
}
