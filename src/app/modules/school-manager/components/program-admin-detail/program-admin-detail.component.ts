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

import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {DataSource} from '../../../../implementation/data/data-source';
import {RouteWatchingService} from '../../../../services/route-watching.service';
import {PROGRAM_ADMIN_DATA_SOURCE} from '../../../shared/shared.module';
import {ProgramAdmin} from '../../models/program-admin/program-admin';
import {deleteDialogCommandFactory, editDialogCommandFactory, newDialogCommandFactory} from './command-factories';

@Component({
  selector: 'ms-program-admin-detail',
  templateUrl: './program-admin-detail.component.html',
  styleUrls: ['./program-admin-detail.component.scss'],
  providers: [RouteWatchingService]
})
export class ProgramAdminDetailComponent implements OnInit {
  @Input() schoolId: string;
  programAdmin: ProgramAdmin;

  constructor(@Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private routeWatcher: RouteWatchingService) {
  }

  ngOnInit(): void {
    this.routeWatcher.open(this.route)
      .subscribe(params => {
        this.programAdminDataSource.allValues()
          .then(admin => {
            this.programAdmin = admin[0];

            this.menuState.add(newDialogCommandFactory(this.router, this.dialog, this.snackBar, this.programAdmin, this.programAdminDataSource,
              this.schoolId));
            this.menuState.add(editDialogCommandFactory(this.router, this.dialog, this.snackBar, this.programAdmin));
            this.menuState.add(deleteDialogCommandFactory(this.router, this.dialog, this.snackBar, this.programAdmin, this.programAdminDataSource));
          });
      });
  }
}
