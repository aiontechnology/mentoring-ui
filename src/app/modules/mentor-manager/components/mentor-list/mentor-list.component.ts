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
import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';
import {School} from 'src/app/implementation/models/school/school';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {UserSessionService} from 'src/app/implementation/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {SchoolRouteWatcher} from '../../../../implementation/route/school-route-watcher';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {MENTOR_DATA_SOURCE, MENTOR_URI_SUPPLIER} from '../../../../providers/global-mentor-providers-factory';
import {SCHOOL_DATA_SOURCE, SCHOOL_INSTANCE_CACHE, SCHOOL_ROUTE_WATCHER} from '../../../../providers/global-school-providers-factory';
import {MENTOR_LIST_MENU, MENTOR_TABLE_CACHE} from '../../mentor-manager.module';
import {Mentor} from '../../models/mentor/mentor';

@Component({
  selector: 'ms-mentor-list',
  templateUrl: './mentor-list.component.html',
  styleUrls: ['./mentor-list.component.scss'],
})
export class MentorListComponent implements OnInit, OnDestroy {

  schools$: Promise<School[]>;

  constructor(public userSession: UserSessionService,
              @Inject(MENTOR_TABLE_CACHE) public tableCache: TableCache<Mentor>,
              @Inject(SCHOOL_INSTANCE_CACHE) public schoolCache: SingleItemCache<School>,
              @Inject(SCHOOL_DATA_SOURCE) private schoolDataSource: DataSource<School>,
              @Inject(MENTOR_URI_SUPPLIER) private uriSupplier: UriSupplier,
              @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
              @Inject(MENTOR_LIST_MENU) private menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
              @Inject(SCHOOL_ROUTE_WATCHER) private schoolRouteWatcher: SchoolRouteWatcher,
              private breakpointObserver: BreakpointObserver,
              private menuState: MenuStateService,
              private route: ActivatedRoute) {
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.tableCache.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.tableCache.paginator = paginator;
    }
  }

  get isSchoolSelected(): boolean {
    return (this.schoolCache.item != null) || this.userSession.isProgAdmin;
  }

  ngOnInit(): void {
    this.menuState.clear()
    this.menuCommands.forEach(command => {
      this.menuState.add(command.factory(false))
    })

    if(this.userSession.isSysAdmin) {
      this.schools$ = this.schoolDataSource.allValues()
      this.schoolRouteWatcher
      this.route.paramMap
        .subscribe(params => this.onIdChange(params.get('schoolId')))
    } else {
      this.onIdChange(this.userSession.schoolUUID)
    }
  }

  onIdChange(id: string) {
    if (id) {
      this.schoolCache.fromId(id)
        .then(school => {
          this.loadMentorData()
        })
    }
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'lastName', 'availability', 'cellPhone'];
    } else {
      return ['select', 'firstName', 'lastName', 'availability', 'cellPhone', 'email', 'mediaReleaseSigned', 'backgroundCheckCompleted'];
    }
  }

  isLoading(gettingData: boolean): boolean {
    return gettingData && this.isSchoolSelected;
  }

  private loadMentorData(): void {
    this.uriSupplier.withSubstitution('schoolId', this.schoolCache.item.id)
    this.mentorDataSource.reset()
    this.tableCache.loadData();
  }
}
