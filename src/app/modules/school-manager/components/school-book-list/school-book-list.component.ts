/*
 * Copyright 2021-2022 Aion Technology LLC
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
import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';
import {SchoolBookCacheService} from 'src/app/modules/school-manager/services/school-book/school-book-cache.service';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {SCHOOL_BOOK_URI_SUPPLIER} from '../../../shared/shared.module';
import {SCHOOL_BOOK_LIST_MENU} from '../../school-manager.module';

@Component({
  selector: 'ms-school-book-list',
  templateUrl: './school-book-list.component.html',
  styleUrls: ['./school-book-list.component.scss']
})
export class SchoolBookListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public schoolBookCacheService: SchoolBookCacheService,
              private menuState: MenuStateService,
              private route: ActivatedRoute,
              private breakpointObserver: BreakpointObserver,
              @Inject(SCHOOL_BOOK_URI_SUPPLIER) private schoolBookUriSupplier: UriSupplier,
              @Inject(SCHOOL_BOOK_LIST_MENU) private menuCommands: Command[]) {
  }

  ngOnInit(): void {
    this.menuState
      .add(this.menuCommands)

    this.route.paramMap
      .subscribe(params => {
        this.schoolBookUriSupplier.withSubstitution('schoolId', params.get('id'))
        this.schoolBookCacheService.loadData()
          .then(() => {
            this.schoolBookCacheService.clearSelection()
          });
      })
  }

  ngAfterViewInit(): void {
    this.schoolBookCacheService.sort = this.sort;
    this.schoolBookCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['title', 'author'];
    } else {
      return ['title', 'author', 'gradeLevel', 'location'];
    }
  }
}
