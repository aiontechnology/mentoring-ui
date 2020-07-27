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

/**
 * Model class the represents a teacher.
 * @author Whitney Hunter
 */
export class Personnel implements LinksHolder<Personnel> {

    type: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    cellPhone: string;
    _links: {
        self: [
            { href: string; }
        ]
    };

    constructor(json?: any) {
        this.type = json?.type;
        this.firstName = json?.firstName;
        this.lastName = json?.lastName;
        this.email = json?.email;
        this.workPhone = json?.workPhone;
        this.cellPhone = json?.cellPhone;
        this._links = json?._links;
    }

    clearLinks(): Personnel {
        this._links = undefined;
        return this;
    }

    getSelfLink(): string {
        return this._links.self[0].href;
    }

}
