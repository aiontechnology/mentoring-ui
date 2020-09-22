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

export class Book implements LinksHolder<Book>{

    id: string;
    title: string;
    author: string;
    gradeLevel: number;
    location: string;
    interests: [ string ];
    leadershipSkills: [string];
    leadershipTraits: [ string ];
    phonograms: [ string ];
    behaviors: [ string ];
    _links: {
        self: [
            { href: string }
        ]
    };

    constructor(json?: any) {
        this.id = json?.id;
        this.title = json?.title;
        this.author = json?.author;
        this.gradeLevel = json?.gradeLevel;
        this.interests = json?.interests;
        this.location = json?.location;
        this.leadershipSkills = json?.leadershipSkills;
        this.leadershipTraits = json?.leadershipTraits;
        this.phonograms = json?.phonograms;
        this.behaviors = json?.behaviors;
        this._links = json?._links;
    }

    clearLinks(): Book {
        this._links = undefined;
        return this;
    }

    getSelfLink(): string {
        return this._links.self[0].href;
    }

}
