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

import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Repository} from '@implementation/data/repository';
import {UriSupplier} from '@implementation/data/uri-supplier';
import {PostAssessmentWorkflow} from '@models/workflow/post-assessment-workflow';
import {POST_ASSESSMENT_WORKFLOW_LOOKUP_URI_SUPPLIER} from '@modules-shared/providers/workflow-providers-factory';

@Injectable()
export class PostAssessmentWorkflowRepository extends Repository<PostAssessmentWorkflow> {

  constructor(
    http: HttpClient,
    @Inject(POST_ASSESSMENT_WORKFLOW_LOOKUP_URI_SUPPLIER) uriSupplier: UriSupplier
  ) {
    super(http, uriSupplier);
  }

  protected override toModel = (value: any) => {
    return PostAssessmentWorkflow.of(value)
  }

}
