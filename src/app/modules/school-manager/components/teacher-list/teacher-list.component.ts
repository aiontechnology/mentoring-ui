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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {AbstractListComponent} from '../../../../implementation/component/abstract-list-component';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {SCHOOL_ID} from '../../../../implementation/route/route-constants';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {Teacher} from '../../models/teacher/teacher';
import {TEACHER_URI_SUPPLIER} from '../../providers/teacher-providers-factory';
import {TEACHER_LIST_MENU, TEACHER_TABLE_CACHE} from '../../school-manager.module';

@Component({
  selector: 'ms-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent extends AbstractListComponent<Teacher> implements OnInit, OnDestroy {
  columns = ['select', 'firstName', 'lastName', 'email', 'cellPhone', 'grades']

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(TEACHER_LIST_MENU) menuCommands: { name: string, factory: ((isAdminOnly: boolean) => Command) }[],
    @Inject(TEACHER_TABLE_CACHE) tableCache: TableCache<Teacher>,
    // other
    private route: ActivatedRoute,
    @Inject(TEACHER_URI_SUPPLIER) private teacherUriSupplier: UriSupplier,
  ) {
    super(menuState, menuCommands, tableCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.init()
    this.route.paramMap
      .subscribe(params => {
        this.teacherUriSupplier.withSubstitution('schoolId', params.get(SCHOOL_ID))
        // this.tableCache.loadData()
        //   .then(() => {
        //     this.tableCache.clearSelection();
        //   });
      });
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected registerMenus(menuState: MenuStateService, menuCommands: { name: string; factory: (isAdminOnly: boolean) => Command }[]) {
    menuCommands.forEach(command => {
      menuState.add(command.factory(false))
    })
  }
}
