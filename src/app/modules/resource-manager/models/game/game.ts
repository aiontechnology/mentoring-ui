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

export class Game implements LinksHolder<Game> {

    id: string;
    name: string;
    grade1: number;
    grade2: number;
    location: string;
    activityFocuses: [string];
    leadershipSkills: [string];
    _links: {
        self: [
            { href: string }
        ]
    };

    constructor(value?: any) {
        console.log('Constructing game', value);
        this.id = value?.id;
        this.name = value?.name;
        if (value.gradeRange) {
            this.grade1 = value?.gradeRange?.grade1;
            this.grade2 = value?.gradeRange?.grade2;
        } else {
            this.grade1 = value?.grade1;
            this.grade2 = value?.grade2;
        }
        this.location = value?.location;
        this.activityFocuses = value?.activityFocuses;
        this.leadershipSkills = value?.leadershipSkills;
        this._links = value?._links;
    }

    clearLinks(): Game {
        this._links = undefined;
        return this;
    }

    getSelfLink(): string {
        return this._links.self[0].href;
    }

}
