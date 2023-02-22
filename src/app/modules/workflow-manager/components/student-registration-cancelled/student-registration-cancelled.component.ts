/*
 * Copyright 2023 Aion Technology LLC
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

import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {StudentRegistrationRepository} from '../../../../implementation/repositories/student-registration-repository';
import {ProgramAdmin} from '../../../../models/program-admin/program-admin';
import {PROGRAM_ADMIN_DATA_SOURCE, PROGRAM_ADMIN_URI_SUPPLIER} from '../../../../providers/global/global-program-admin-providers-factory';
import {REGISTRATION_URI_SUPPLIER} from '../../../shared/providers/workflow-providers-factory';

@Component({
  selector: 'ms-student-registration-cancelled',
  templateUrl: './student-registration-cancelled.component.html',
  styleUrls: ['./student-registration-cancelled.component.scss']
})
export class StudentRegistrationCancelledComponent implements OnInit {
  programAdmin: ProgramAdmin

  constructor(
    private registrationRepository: StudentRegistrationRepository,
    @Inject(REGISTRATION_URI_SUPPLIER) private registrationUriSuppler: UriSupplier,
    @Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
    @Inject(PROGRAM_ADMIN_URI_SUPPLIER) private programAdminUriSupplier: UriSupplier,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        this.programAdminUriSupplier.withSubstitution('schoolId', params.get('schoolId'))
        this.programAdminDataSource.allValues()
          .then(programAdmins => {
            this.programAdmin = programAdmins?.[0]
          })

        const registrationId = params.get('registrationId')
        this.registrationUriSuppler.withSubstitution('schoolId', params.get('schoolId'))
        const uri = this.registrationUriSuppler.apply(registrationId)
        this.registrationRepository.delete(uri)
      })
  }

}
