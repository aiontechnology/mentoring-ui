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

export class StudentInformation {
  constructor(
    public leadershipSkills: string[],
    public leadershipTraits: string[],
    public behaviors: string[],
    public teacherComment: string,
    public question1: number,
    public question2: number,
    public question3: number,
    public question4: number,
    public question5: number,
    public question6: number,
    public question7: number,
    public question8: number,
    public question9: number,
    public question10: number,
    public question11: number,
    public question12: number,
    public question13: number,
    public question14: number,
    public question15: number,
    public question16: number,
    public question17: number,
    public question18: number,
    public question19: number,
    public question20: number,
    public question21: number,
    public question22: number,
    public question23: number,
    public question24: number,
    public question25: number,
    public question26: number,
    public question27: number,
    public question28: number,
    public question29: number,
    public question30: number,
    public question31: number,
    public question32: number,
    public question33: number,
    public question34: number,
    public question35: number,
  ) {}

  static of(value: any): StudentInformation {
    return new StudentInformation(
      value?.leadershipSkills,
      value?.leadershipTraits,
      value?.behaviors,
      value?.teacherComment,
      value?.question1,
      value?.question2,
      value?.question3,
      value?.question4,
      value?.question5,
      value?.question6,
      value?.question7,
      value?.question8,
      value?.question9,
      value?.question10,
      value?.question11,
      value?.question12,
      value?.question13,
      value?.question14,
      value?.question15,
      value?.question16,
      value?.question17,
      value?.question18,
      value?.question19,
      value?.question20,
      value?.question21,
      value?.question22,
      value?.question23,
      value?.question24,
      value?.question25,
      value?.question26,
      value?.question27,
      value?.question28,
      value?.question29,
      value?.question30,
      value?.question31,
      value?.question32,
      value?.question33,
      value?.question34,
      value?.question35,
    )
  }
}
