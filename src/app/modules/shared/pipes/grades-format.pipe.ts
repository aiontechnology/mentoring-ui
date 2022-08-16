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

import { Pipe, PipeTransform } from '@angular/core';
import { grades } from '../constants/grades';
import { Teacher } from 'src/app/modules/school-manager/models/teacher/teacher';

@Pipe({
  name: 'grades'
})

export class GradesFormatPipe implements PipeTransform {
  transform(teacher: Teacher): string {
    const part1 = grades[teacher.grade1]?.valueView;
    const part2 = grades[teacher.grade2]?.valueView ? ', ' + grades[teacher.grade2].valueView : '';
    return part1 + part2;
  }
}
