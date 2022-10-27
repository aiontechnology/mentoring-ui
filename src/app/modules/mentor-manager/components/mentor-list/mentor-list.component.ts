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
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {CommandArray} from '../../../../implementation/component/abstract-component';
import {AbstractListComponent} from '../../../../implementation/component/abstract-list-component';
import {SchoolUriSupplier} from '../../../../implementation/data/school-uri-supplier';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {TableCache} from '../../../../implementation/table-cache/table-cache';
import {MENTOR_INSTANCE_CACHE, MENTOR_URI_SUPPLIER} from '../../../../providers/global-mentor-providers-factory';
import {MENTOR_LIST_MENU, MENTOR_TABLE_CACHE} from '../../mentor-manager.module';
import {Mentor} from '../../models/mentor/mentor';

@Component({
  selector: 'ms-mentor-list',
  templateUrl: './mentor-list.component.html',
  styleUrls: ['./mentor-list.component.scss'],
})
export class MentorListComponent extends AbstractListComponent<Mentor> implements OnInit, OnDestroy {
  columns = ['select', 'firstName', 'lastName', 'availability', 'cellPhone', 'email', 'mediaReleaseSigned', 'backgroundCheckCompleted']

  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(MENTOR_LIST_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    @Inject(MENTOR_TABLE_CACHE) tableCache: TableCache<Mentor>,
    @Inject(MENTOR_INSTANCE_CACHE) mentorInstanceCache: SingleItemCache<Mentor>,
    // other
    @Inject(MENTOR_URI_SUPPLIER) private schoolUriSupplier: SchoolUriSupplier,
  ) {
    super(menuState, menuCommands, tableCache, mentorInstanceCache)
  }

  @ViewChild(MatSort) set sort(sort: MatSort) { super.sort = sort }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) { super.paginator = paginator }

  ngOnInit(): void {
    this.schoolUriSupplier.observable.subscribe(this.loadTableCache)
    this.init()
      .then(() => console.log('Initialization complete', this))
  }

  ngOnDestroy(): void {
    this.destroy()
      .then(() => console.log('Destruction complete', this))
  }
}
