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

import {ActivatedRoute, ParamMap} from '@angular/router';
import {School} from '../modules/shared/models/school/school';
import {UserSessionService} from './user-session.service';
import {DataSource} from '../implementation/data/data-source';
import {map} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';
import {
  INVITATION_DATA_SOURCE, INVITATION_URI_SUPPLIER,
  MENTOR_DATA_SOURCE,
  MENTOR_URI_SUPPLIER,
  PERSONNEL_DATA_SOURCE,
  PERSONNEL_URI_SUPPLIER,
  PROGRAM_ADMIN_DATA_SOURCE,
  PROGRAM_ADMIN_URI_SUPPLIER,
  SCHOOL_BOOK_DATA_SOURCE,
  SCHOOL_BOOK_URI_SUPPLIER,
  SCHOOL_DATA_SOURCE,
  SCHOOL_SESSION_DATA_SOURCE,
  SCHOOL_SESSION_URI_SUPPLIER,
  STUDENT_DATA_SOURCE,
  STUDENT_URI_SUPPLIER,
  TEACHER_DATA_SOURCE,
  TEACHER_URI_SUPPLIER
} from '../modules/shared/shared.module';
import {UriSupplier} from '../implementation/data/uri-supplier';
import {Observable, of} from 'rxjs';
import {Mentor} from '../modules/mentor-manager/models/mentor/mentor';
import {Teacher} from '../modules/school-manager/models/teacher/teacher';
import {SchoolSession} from '../modules/shared/models/school/schoolsession';
import {Student} from '../modules/student-manager/models/student/student';
import {Personnel} from '../modules/school-manager/models/personnel/personnel';
import {Book} from '../modules/shared/models/book/book';
import {ProgramAdmin} from '../modules/school-manager/models/program-admin/program-admin';

@Injectable()
export class RouteWatchingService {

  static SCHOOL_ID = 'schoolId';
  static MENTOR_ID = 'mentorId';

  private ids = new Map<string, string>();

  constructor(private userSession: UserSessionService,
              @Inject(INVITATION_DATA_SOURCE) private invitationDataSource: DataSource<Mentor>,
              @Inject(INVITATION_URI_SUPPLIER) private invitationUriSupplier: UriSupplier,
              @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
              @Inject(MENTOR_URI_SUPPLIER) private mentorUriSupplier: UriSupplier,
              @Inject(PERSONNEL_DATA_SOURCE) private personnelDataSource: DataSource<Personnel>,
              @Inject(PERSONNEL_URI_SUPPLIER) private personnelUriSupplier: UriSupplier,
              @Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
              @Inject(PROGRAM_ADMIN_URI_SUPPLIER) private programAdminUriSupplier: UriSupplier,
              @Inject(SCHOOL_DATA_SOURCE) private schoolDataSource: DataSource<School>,
              @Inject(SCHOOL_BOOK_DATA_SOURCE) private schoolBookDataSource: DataSource<Book>,
              @Inject(SCHOOL_BOOK_URI_SUPPLIER) private schoolBookUriSuppler: UriSupplier,
              @Inject(SCHOOL_SESSION_DATA_SOURCE) private schoolSessionDataSource: DataSource<SchoolSession>,
              @Inject(SCHOOL_SESSION_URI_SUPPLIER) private schoolSessionUriSupplier: UriSupplier,
              @Inject(STUDENT_DATA_SOURCE) private studentDataSource: DataSource<Student>,
              @Inject(STUDENT_URI_SUPPLIER) private studentUriSupplier: UriSupplier,
              @Inject(TEACHER_DATA_SOURCE) private teacherDataSource: DataSource<Teacher>,
              @Inject(TEACHER_URI_SUPPLIER) private teacherUriSupplier: UriSupplier) {
  }

  get schoolId(): string {
    return this.ids.get(RouteWatchingService.SCHOOL_ID);
  }

  set schoolId(schoolId) {
    if (schoolId) {
      this.ids.set(RouteWatchingService.SCHOOL_ID, schoolId);
    }
    this.onSchoolIdChange(schoolId);
  }

  get school(): Promise<School> {
    return this.schoolId
      ? this.schoolDataSource.oneValue(this.schoolId)
      : Promise.resolve(null);
  }

  open(route: ActivatedRoute): Observable<Map<string, string>> {
    console.log('Opening RouteWatchingService');
    return route.paramMap
      .pipe(
        map(params => {
          this.schoolId = this.userSession.isSysAdmin
            ? this.findParameterAndCache(RouteWatchingService.SCHOOL_ID, params)
            : this.userSession.schoolUUID;
          return params;
        }),
        map(params => {
          this.findParameterAndCache(RouteWatchingService.MENTOR_ID, params);
        }),
        map(() => this.ids)
      );
  }

  close(): void {
    console.log('Closing RouteWatchingService');
    this.ids.clear();
  }

  private findParameterAndCache(name: string, params: ParamMap): string {
    const id = params.get(name);
    if (id) {
      this.ids.set(name, id);
    }
    return id;
  }

  private programAdminStrategy = (): Observable<Map<string, string>> => {
    this.schoolId = this.userSession.schoolUUID;
    const ids = new Map([[RouteWatchingService.SCHOOL_ID, this.schoolId]]);
    return of(ids);
  }

  private onSchoolIdChange = (schoolId: string) => {
    this.invitationUriSupplier.reset();
    this.mentorUriSupplier.reset();
    this.personnelUriSupplier.reset();
    this.programAdminUriSupplier.reset();
    this.schoolBookUriSuppler.reset();
    this.schoolSessionUriSupplier.reset();
    this.studentUriSupplier.reset();
    this.teacherUriSupplier.reset();
    if (schoolId) {
      this.invitationDataSource.reset();
      this.invitationUriSupplier.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
      this.mentorDataSource.reset();
      this.mentorUriSupplier.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
      this.personnelDataSource.reset();
      this.personnelUriSupplier.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
      this.programAdminDataSource.reset();
      this.programAdminUriSupplier.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
      this.schoolBookDataSource.reset();
      this.schoolBookUriSuppler.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
      this.schoolSessionDataSource.reset();
      this.schoolSessionUriSupplier.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
      this.studentDataSource.reset();
      this.studentUriSupplier.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
      this.teacherDataSource.reset();
      this.teacherUriSupplier.withSubstitution(RouteWatchingService.SCHOOL_ID, schoolId);
    }
  }

}
