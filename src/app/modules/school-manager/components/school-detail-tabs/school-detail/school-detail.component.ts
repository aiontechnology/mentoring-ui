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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../../implementation/command/command';
import {CommandArray} from '../../../../../implementation/component/abstract-component';
import {AbstractDetailComponent} from '../../../../../implementation/component/abstract-detail-component';
import {SchoolUriSupplier} from '../../../../../implementation/data/school-uri-supplier';
import {SingleItemCache} from '../../../../../implementation/data/single-item-cache';
import {School} from '../../../../../implementation/models/school/school';
import {SCHOOL_INSTANCE_CACHE, SCHOOL_URI_SUPPLIER} from '../../../../../providers/global-school-providers-factory';
import {SCHOOL_DETAIL_MENU} from '../../../school-manager.module';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent extends AbstractDetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(SCHOOL_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    @Inject(SCHOOL_URI_SUPPLIER) uriSupplier: SchoolUriSupplier,
    // other
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
  ) {
    super(menuState, menuCommands, route, uriSupplier)
  }

  ngOnInit(): void {
    this.init()
      .then(() => console.log('Initialization complete', this))
  }

  ngOnDestroy(): void {
    this.destroy()
      .then(() => console.log('Destruction complete', this))
  }

  protected override registerMenus(menuState: MenuStateService, menuCommands: CommandArray) {
    menuCommands.forEach(command => {
      switch (command.name) {
        case 'delete':
          menuState.add(command.factory(true))
          break
        default:
          menuState.add(command.factory(false))
          break;
      }
    })
  }

}

