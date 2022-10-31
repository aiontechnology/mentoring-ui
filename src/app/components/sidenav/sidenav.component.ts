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

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {UserSessionService} from 'src/app/implementation/services/user-session.service';
import {School} from '../../implementation/models/school/school';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {SCHOOL_INSTANCE_CACHE} from '../../providers/global-school-providers-factory';

@Component({
  selector: 'ms-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isHandset$: Observable<boolean>;

  constructor(
    public userSession: UserSessionService,
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => (result.matches)),
        shareReplay()
      );
  }
}
