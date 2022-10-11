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

import {LayoutModule} from '@angular/cdk/layout';
import {CommonModule} from '@angular/common';
import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MaterialModule} from 'src/app/shared/material.module';
import {environment} from '../../../environments/environment';
import {Cache} from '../../implementation/data/cache';
import {DataSource} from '../../implementation/data/data-source';
import {Repository} from '../../implementation/data/repository';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {Mentor} from '../mentor-manager/models/mentor/mentor';
import {MentorRepository} from '../mentor-manager/repositories/mentor-repository';
import {MentorCacheService} from '../mentor-manager/services/mentor/mentor-cache.service';
import {BookRepository} from '../resource-manager/repositories/book-repository';
import {GameRepository} from '../resource-manager/repositories/game-repository';
import {Personnel} from '../school-manager/models/personnel/personnel';
import {ProgramAdmin} from '../school-manager/models/program-admin/program-admin';
import {Teacher} from '../school-manager/models/teacher/teacher';
import {Invitation} from '../school-manager/models/workflow/invitation';
import {StudentRegistration} from '../school-manager/models/workflow/student-registration';
import {StudentRegistrationLookup} from '../school-manager/models/workflow/student-registration-lookup';
import {StudentRegistrationLookupRepository} from '../school-manager/repositories/student-registration-lookup-repository';
import {StudentRegistrationRepository} from '../school-manager/repositories/student-registration-repository';
import {TeacherRepository} from '../school-manager/repositories/teacher-repository';
import {SchoolBookCacheService} from '../school-manager/services/school-book/school-book-cache.service';
import {Student} from '../student-manager/models/student/student';
import {PersonnelRepository} from '../student-manager/repositories/personnel-repository';
import {StudentRepository} from '../student-manager/repositories/student-repository';
import {StudentCacheService} from '../student-manager/services/student/student-cache.service';
import {ConfimationDialogComponent} from './components/confimation-dialog/confimation-dialog.component';
import {SelectionCountDisplayComponent} from './components/selection-count-display/selection-count-display.component';
import {OnlyNumberDirective} from './directives/only-number.directive';
import {PhoneFormatDirective} from './directives/phone-format.directive';
import {Book} from './models/book/book';
import {Game} from './models/game/game';
import {School} from './models/school/school';
import {SchoolSession} from './models/school/schoolsession';
import {InvitationRepository} from './repositories/invitation-repository';
import {ProgramAdminRepository} from './repositories/program-admin-repository';
import {SchoolBookRepository} from './repositories/school-book-repository';
import {SchoolGameRepository} from './repositories/school-game-repository';
import {SchoolRepository} from './repositories/school-repository';
import {SchoolSessionRepository} from './repositories/school-session-repository';
import {MetaDataService} from './services/meta-data/meta-data.service';
import {SchoolGameCacheService} from './services/school-resource/school-game/school-game-cache.service';
import {SchoolSessionCacheService} from './services/school-session/school-session-cache.service';

export const BOOK_DATA_SOURCE = new InjectionToken<DataSource<Book>>('book-data-source');
export const BOOK_CACHE = new InjectionToken<Cache<Book>>('book-cache');
export const BOOK_URI_SUPPLIER = new InjectionToken<UriSupplier>('book-uri-supplier');

export const GAME_DATA_SOURCE = new InjectionToken<DataSource<Game>>('game-data-source');
export const GAME_CACHE = new InjectionToken<Cache<Game>>('game-cache');
export const GAME_URI_SUPPLIER = new InjectionToken<UriSupplier>('game-uri-supplier');

export const INVITATION_DATA_SOURCE = new InjectionToken<DataSource<Invitation>>('invitation-data-source');
export const INVITATION_URI_SUPPLIER = new InjectionToken<UriSupplier>('invitation-uri-supplier');

export const MENTOR_DATA_SOURCE = new InjectionToken<DataSource<Mentor>>('mentor-data-source');
export const MENTOR_CACHE = new InjectionToken<Cache<Mentor>>('mentor-cache');
export const MENTOR_URI_SUPPLIER = new InjectionToken<UriSupplier>('mentor-uri-supplier');

export const PERSONNEL_DATA_SOURCE = new InjectionToken<DataSource<Personnel>>('personnel-data-source');
export const PERSONNEL_CACHE = new InjectionToken<Cache<Personnel>>('personnel-cache');
export const PERSONNEL_URI_SUPPLIER = new InjectionToken<UriSupplier>('personnel-uri-supplier');

export const PROGRAM_ADMIN_DATA_SOURCE = new InjectionToken<DataSource<ProgramAdmin>>('program-admin-detail-data-source');
export const PROGRAM_ADMIN_CACHE = new InjectionToken<Cache<Personnel>>('program-admin-detail-cache');
export const PROGRAM_ADMIN_URI_SUPPLIER = new InjectionToken<UriSupplier>('program-admin-detail-uri-supplier');

export const REGISTRATION_LOOKUP_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistrationLookup>>('registration-lookup-data-source');
export const REGISTRATION_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistration>>('registration-data-source');
export const REGISTRATION_URI_SUPPLIER = new InjectionToken<UriSupplier>('registration-uri-supplier');

export const SCHOOL_DATA_SOURCE = new InjectionToken<DataSource<School>>('school-data-source');
export const SCHOOL_CACHE = new InjectionToken<Cache<School>>('school-cache');
export const SCHOOL_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-uri-supplier');

export const SCHOOL_SESSION_DATA_SOURCE = new InjectionToken<DataSource<SchoolSession>>('school-session-data-source');
export const SCHOOL_SESSION_CACHE = new InjectionToken<Cache<SchoolSession>>('school-session-cache');
export const SCHOOL_SESSION_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-session-uri-supplier');

export const SCHOOL_BOOK_DATA_SOURCE = new InjectionToken<DataSource<Book>>('school-book-data-source');
export const SCHOOL_BOOK_CACHE = new InjectionToken<Cache<Book>>('school-book-cache');
export const SCHOOL_BOOK_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-book-uri-supplier');

export const SCHOOL_GAME_DATA_SOURCE = new InjectionToken<DataSource<Game>>('school-game-data-source');
export const SCHOOL_GAME_CACHE = new InjectionToken<Cache<Game>>('school-game-cache');
export const SCHOOL_GAME_URI_SUPPLIER = new InjectionToken<UriSupplier>('school-game-uri-supplier');

export const STUDENT_DATA_SOURCE = new InjectionToken<DataSource<Student>>('student-data-source');
export const STUDENT_CACHE = new InjectionToken<Cache<Student>>('student-cache');
export const STUDENT_URI_SUPPLIER = new InjectionToken<UriSupplier>('student-uri-supplier');

export const TEACHER_DATA_SOURCE = new InjectionToken<DataSource<Teacher>>('teacher-data-source');
export const TEACHER_CACHE = new InjectionToken<Cache<Teacher>>('teacher-cache');
export const TEACHER_URI_SUPPLIER = new InjectionToken<UriSupplier>('teacher-uri-supplier');

@NgModule({
  declarations: [
    // Components
    ConfimationDialogComponent,
    SelectionCountDisplayComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,
  ],
  exports: [
    // Components
    ConfimationDialogComponent,
    SelectionCountDisplayComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,

    // Modules
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        /* Book resources */
        {
          provide: BOOK_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/books`)
        },
        BookRepository,
        {
          provide: BOOK_CACHE,
          useFactory: () => new Cache<Book>()
        },
        {
          provide: BOOK_DATA_SOURCE,
          useFactory: (repository: Repository<Book>, cache: Cache<Book>) => new DataSource<Book>(repository, cache),
          deps: [BookRepository, BOOK_CACHE]
        },

        /* Game resources */
        {
          provide: GAME_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/games`)
        },
        GameRepository,
        {
          provide: GAME_CACHE,
          useFactory: () => new Cache<Game>()
        },
        {
          provide: GAME_DATA_SOURCE,
          useFactory: (repository: Repository<Game>, cache: Cache<Game>) => new DataSource<Game>(repository, cache),
          deps: [GameRepository, GAME_CACHE]
        },

        /* Invitation resources */
        {
          provide: INVITATION_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/invitations`)
        },
        InvitationRepository,
        {
          provide: INVITATION_DATA_SOURCE,
          useFactory: (repository: Repository<Invitation>) => new DataSource<Invitation>(repository),
          deps: [InvitationRepository]
        },

        /* Mentor resources */
        {
          provide: MENTOR_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/mentors`)
        },
        MentorRepository,
        {
          provide: MENTOR_CACHE,
          useFactory: () => new Cache<Mentor>()
        },
        {
          provide: MENTOR_DATA_SOURCE,
          useFactory: (repository: Repository<Mentor>, cache: Cache<Mentor>) => new DataSource<Mentor>(repository, cache),
          deps: [MentorRepository, MENTOR_CACHE]
        },
        MentorCacheService,

        /* Personnel resources */
        {
          provide: PERSONNEL_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/personnel`)
        },
        PersonnelRepository,
        {
          provide: PERSONNEL_CACHE,
          useFactory: () => new Cache<Personnel>()
        },
        {
          provide: PERSONNEL_DATA_SOURCE,
          useFactory: (repository: Repository<Personnel>, cache: Cache<Personnel>) => new DataSource<Personnel>(repository, cache),
          deps: [PersonnelRepository, PERSONNEL_CACHE]
        },

        /* Program admin resources */
        {
          provide: PROGRAM_ADMIN_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/programAdmins`)
        },
        ProgramAdminRepository,
        {
          provide: PROGRAM_ADMIN_CACHE,
          useFactory: () => new Cache<ProgramAdmin>()
        },
        {
          provide: PROGRAM_ADMIN_DATA_SOURCE,
          useFactory: (repository: Repository<ProgramAdmin>, cache: Cache<ProgramAdmin>) => new DataSource<ProgramAdmin>(repository, cache),
          deps: [ProgramAdminRepository, PROGRAM_ADMIN_CACHE]
        },

        /* Registration resources */
        {
          provide: REGISTRATION_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/registrations`)
        },
        StudentRegistrationLookupRepository,
        {
          provide: REGISTRATION_LOOKUP_DATA_SOURCE,
          useFactory: (repository: Repository<StudentRegistrationLookup>) => new DataSource<StudentRegistrationLookup>(repository),
          deps: [StudentRegistrationLookupRepository]
        },
        StudentRegistrationRepository,
        {
          provide: REGISTRATION_DATA_SOURCE,
          useFactory: (repository: Repository<StudentRegistration>) => new DataSource<StudentRegistration>(repository),
          deps: [StudentRegistrationRepository]
        },

        /* School resources */
        {
          provide: SCHOOL_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools`)
        },
        SchoolRepository,
        {
          provide: SCHOOL_CACHE,
          useFactory: () => new Cache<School>()
        },
        {
          provide: SCHOOL_DATA_SOURCE,
          useFactory: (repository: Repository<School>, cache: Cache<School>) => new DataSource(repository, cache),
          deps: [SchoolRepository, SCHOOL_CACHE]
        },

        /* School session resources */
        {
          provide: SCHOOL_SESSION_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/schoolsessions`)
        },
        SchoolSessionRepository,
        {
          provide: SCHOOL_SESSION_CACHE,
          useFactory: () => new Cache<SchoolSession>()
        },
        {
          provide: SCHOOL_SESSION_DATA_SOURCE,
          useFactory: (repository: Repository<SchoolSession>, cache: Cache<SchoolSession>) => new DataSource(repository, cache),
          deps: [SchoolSessionRepository, SCHOOL_SESSION_CACHE]
        },
        SchoolSessionCacheService,

        /* School book resources */
        {
          provide: SCHOOL_BOOK_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/books`)
        },
        SchoolBookRepository,
        {
          provide: SCHOOL_BOOK_CACHE,
          useFactory: () => new Cache<Book>()
        },
        {
          provide: SCHOOL_BOOK_DATA_SOURCE,
          useFactory: (repository: Repository<Book>, cache: Cache<Book>) => new DataSource(repository, cache),
          deps: [SchoolBookRepository, SCHOOL_BOOK_CACHE]
        },
        SchoolBookCacheService,

        /* School game resources */
        {
          provide: SCHOOL_GAME_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/games`)
        },
        SchoolGameRepository,
        {
          provide: SCHOOL_GAME_CACHE,
          useFactory: () => new Cache<Game>()
        },
        {
          provide: SCHOOL_GAME_DATA_SOURCE,
          useFactory: (repository: Repository<Game>, cache: Cache<Game>) => new DataSource(repository, cache),
          deps: [SchoolGameRepository, SCHOOL_GAME_CACHE]
        },
        SchoolGameCacheService,

        /* Student resources */
        {
          provide: STUDENT_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/students`)
        },
        StudentRepository,
        {
          provide: STUDENT_CACHE,
          useFactory: () => new Cache<Student>()
        },
        {
          provide: STUDENT_DATA_SOURCE,
          useFactory: (repository: Repository<Student>, cache: Cache<Student>) => new DataSource<Student>(repository, cache),
          deps: [StudentRepository, STUDENT_CACHE]
        },
        StudentCacheService,

        /* Teacher resources */
        {
          provide: TEACHER_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/teachers`)
        },
        TeacherRepository,
        {
          provide: TEACHER_CACHE,
          useFactory: () => new Cache<Teacher>()
        },
        {
          provide: TEACHER_DATA_SOURCE,
          useFactory: (repository: Repository<Teacher>, cache: Cache<Teacher>) => new DataSource<Teacher>(repository, cache),
          deps: [TeacherRepository, TEACHER_CACHE]
        },

        // Services
        MetaDataService
      ]
    };
  }

}
