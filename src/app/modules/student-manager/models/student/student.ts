/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LinksHolder } from 'src/app/implementation/repository/links-holder';

interface StudentLeadershipSkills {
    person: string;
    type: string;
    leadershipSkill: string;
}

interface StudentLeadershipTraits {
    person: string;
    type: string;
    leadershipTrait: string;
}

interface StudentPersons {
    person: string;
    type: string;
}

export class Student implements LinksHolder<Student> {

    firstName: string;
    lastName: string;
    preferredTime: string;
    studentLeadershipSkills: StudentLeadershipSkills[];
    studentLeadershipTraits: StudentLeadershipTraits[];
    studentPersons: StudentPersons[];
    teacher: string;
    _links: {
        self: [
            { href: string; }
        ]
    };

    constructor(json?: any) {
        this.firstName = json?.firstName;
        this.lastName = json?.lastName;
        this.preferredTime = json?.preferredTime;
        this.studentLeadershipSkills = json?.studentLeadershipSkills;
        this.studentLeadershipTraits = json?.studentLeadershipTraits;
        this.teacher = json?.teacher;
    }

    clearLinks(): Student {
        this._links = undefined;
        return this;
    }

    getSelfLink(): string {
        return this._links?.self[0]?.href;
    }

}
