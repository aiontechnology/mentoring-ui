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

import {StudentAssessment} from '@models/workflow/student-assessment';

export class StudentInformation {
  constructor(
    public leadershipSkills: string[],
    public leadershipTraits: string[],
    public behaviors: string[],
    public teacherComment: string,
    public studentAssessment: StudentAssessment,
  ) {}

  static of(value: any): StudentInformation {
    return new StudentInformation(
      value?.leadershipSkills,
      value?.leadershipTraits,
      value?.behaviors,
      value?.teacherComment,
      value?.studentAssessment,
    )
  }
}
