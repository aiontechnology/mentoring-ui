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

import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {ProgramAdmin} from '../../models/program-admin/program-admin';
import {PROGRAM_ADMIN_DATA_SOURCE, PROGRAM_ADMIN_URI_SUPPLIER} from '../../providers/program-admin-providers-factory';
import {PROGRAM_ADMIN_INSTANCE_CACHE, PROGRAM_ADMIN_MENU} from '../../school-manager.module';

@Component({
  selector: 'ms-program-admin-detail',
  templateUrl: './program-admin-detail.component.html',
  styleUrls: ['./program-admin-detail.component.scss']
})
export class ProgramAdminDetailComponent implements OnInit {
  constructor(private menuState: MenuStateService,
              private route: ActivatedRoute,
              @Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
              @Inject(PROGRAM_ADMIN_INSTANCE_CACHE) private programAdminCache: SingleItemCache<ProgramAdmin>,
              @Inject(PROGRAM_ADMIN_URI_SUPPLIER) private programAdminUriSupplier: UriSupplier,
              @Inject(PROGRAM_ADMIN_MENU) private menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[]) {
  }

  get programAdmin() {
    return this.programAdminCache.item;
  }

  ngOnInit(): void {
    this.menuCommands.forEach(command => {
      this.menuState.add(command.factory(false))
    })

    this.route.paramMap
      .subscribe(params => {
        this.programAdminUriSupplier.withSubstitution('schoolId', params.get('id'));
        this.programAdminDataSource.allValues()
          .then(admin => {
            this.programAdminCache.item = admin[0];
          });
      });
  }
}
