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

import { Student } from '../student/student';
import { Teacher } from 'src/app/implementation/models/teacher/teacher';

interface StudentTeacherOutbound {
  uri: string;
  comment: string;
}

interface StudentMentorOutbound {
  uri: string;
}

export class StudentOutbound extends Student {

  teacher: StudentTeacherOutbound;
  mentor: StudentMentorOutbound;

  constructor(json?: any) {
    super(json);
    this.teacher = json?.teacher;
    this.mentor = json?.mentor;
  }

}
