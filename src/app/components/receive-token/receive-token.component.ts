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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'ms-receive-token',
  templateUrl: './receive-token.component.html',
  styleUrls: ['./receive-token.component.scss']
})
export class ReceiveTokenComponent implements OnInit {

  constructor(public userSession: UserSessionService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(this.parseToken);
  }

  private parseToken(fragment: string): void {
    UserSessionService.handleLogin(new URLSearchParams(fragment));
  }

}

