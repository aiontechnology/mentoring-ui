/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SchoolCacheService } from '../../services/school/school-cache.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'ms-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public schoolCacheService: SchoolCacheService,
              private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.schoolCacheService.establishDatasource();
  }

  ngAfterViewInit(): void {
    this.schoolCacheService.sort = this.sort;
    this.schoolCacheService.paginator = this.paginator;
  }

  activeMenus(): Map<string, any> {
    const menus = new Map<string, any>();
    menus.set('add-school', {});
    menus.set('edit-school', {});
    menus.set('remove-school', {});
    return menus;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'name'];
    } else {
      return ['select', 'name', 'city', 'state', 'district', 'phone', 'private'];
    }
  }

}
