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

import {LinksHolder} from 'src/app/implementation/repository/links-holder';
import {LinkServiceService} from 'src/app/modules/shared/services/link-service/link-service.service';
import {IdAware} from '../../../../implementation/repository/id-aware';

/**
 * Model class the represents a teacher.
 * @author Whitney Hunter
 */
export class Personnel implements LinksHolder<Personnel>, IdAware<string> {
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  links: {
    self: [
      { href: string; }
    ]
  };

  constructor(json?: any) {
    this.type = json?.type;
    this.firstName = json?.firstName;
    this.lastName = json?.lastName;
    this.email = (json?.email === '') ? null : json?.email;
    this.cellPhone = json?.cellPhone;
    this.links = json?.links;
  }

  get id(): string {
    return this.links?.self?.length > 0
      ? this.links?.self[0]?.href
      : undefined;
  }

  clearLinks(): Personnel {
    this.links = undefined;
    return this;
  }

  getSelfLink(): string {
    return LinkServiceService.selfLink(JSON.stringify(this));
  }

}
