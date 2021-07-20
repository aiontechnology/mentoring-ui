/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

/**
 * Model class the represents a teacher.
 * @author Whitney Hunter
 */
export class Teacher implements LinksHolder<Teacher> {

    firstName: string;
    lastName: string;
    email: string;
    cellPhone: string;
    grade1: number;
    grade2: number;
    _links: {
        self: [
            { href: string; }
        ]
    };

    constructor(json?: any) {
        this.firstName = json?.firstName;
        this.lastName = json?.lastName;
        this.email = (json?.email === '') ? null : json?.email;
        this.cellPhone = json?.cellPhone;
        this.grade1 = json?.grade1;
        this.grade2 = json?.grade2;
        this._links = json?._links;
    }

    clearLinks(): Teacher {
        this._links = undefined;
        return this;
    }

    grades(): string {
        return this.grade1 + this.grade2 ? ', ' + this.grade2 : '';
    }

    getSelfLink(): string {
        return this._links?.self[0]?.href;
    }

}
