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

import {InjectionToken} from '@angular/core';
import {DataSource} from '@implementation/data/data-source';
import {Repository} from '@implementation/data/repository';
import {UriSupplier} from '@implementation/data/uri-supplier';
import {PostAssessmentRepository} from '@implementation/repositories/post-assessment-repository';
import {SchoolChangeUriSupplierHandler} from '@implementation/state-management/school-change-uri-supplier-handler';
import {SingleItemCache} from '@implementation/state-management/single-item-cache';
import {School} from '@models/school/school';
import {PostAssessment} from '@models/workflow/post-assessment';
import {SCHOOL_INSTANCE_CACHE} from '@providers/global/global-school-providers-factory';
import {environment} from '../../../environments/environment';

export const POST_ASSESSMENT_DATA_SOURCE = new InjectionToken<DataSource<PostAssessment>>('post-assessment-data-source')
export const POST_ASSESSMENT_URI_SUPPLIER = new InjectionToken<UriSupplier>('post-assessment-uri-supplier')
export const POST_ASSESSMENT_URI_SUPPLIER_UPDATER = new InjectionToken('post-assessment-uri-supplier-updater')

export function globalAssessmentProvidersFactory() {
  return [
    {
      provide: POST_ASSESSMENT_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/workflow/assessments`)
    },
    PostAssessmentRepository,
    {
      provide: POST_ASSESSMENT_DATA_SOURCE,
      useFactory: (repository: Repository<PostAssessment>) => new DataSource<PostAssessment>(repository),
      deps: [PostAssessmentRepository]
    },
    {
      provide: POST_ASSESSMENT_URI_SUPPLIER_UPDATER,
      useFactory: (schoolItemCache: SingleItemCache<School>, uriSupplier: UriSupplier) =>
        new SchoolChangeUriSupplierHandler(schoolItemCache, uriSupplier),
      deps: [SCHOOL_INSTANCE_CACHE, POST_ASSESSMENT_URI_SUPPLIER]
    }
  ]
}
