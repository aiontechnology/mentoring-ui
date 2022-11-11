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

import {InjectionToken} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DataSource} from '../../implementation/data/data-source';
import {Repository} from '../../implementation/data/repository';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {School} from '../../implementation/models/school/school';
import {Invitation} from '../../implementation/models/workflow/invitation';
import {InvitationRepository} from '../../implementation/repositories/invitation-repository';
import {SchoolChangeUriSupplierHandler} from '../../implementation/state-management/school-change-uri-supplier-handler';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {SingleItemCacheSchoolChangeHandler} from '../../implementation/state-management/single-item-cache-school-change-handler';
import {SCHOOL_INSTANCE_CACHE} from './global-school-providers-factory';

export const INVITATION_DATA_SOURCE = new InjectionToken<DataSource<Invitation>>('invitation-data-source');
export const INVITATION_URI_SUPPLIER = new InjectionToken<UriSupplier>('invitation-uri-supplier');
export const INVITATION_URI_SUPPLIER_UPDATER = new InjectionToken<SchoolChangeUriSupplierHandler>('invitation-uri-supplier-updater');

export function globalInvitationProvidersFactory() {
  return [
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
    {
      provide: INVITATION_URI_SUPPLIER_UPDATER,
      useFactory: (schoolItemCache: SingleItemCache<School>, uriSupplier: UriSupplier) =>
        new SchoolChangeUriSupplierHandler(schoolItemCache, uriSupplier),
      deps: [SCHOOL_INSTANCE_CACHE, INVITATION_URI_SUPPLIER]
    }
  ]
}
