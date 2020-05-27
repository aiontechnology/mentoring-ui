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

import { Component, OnInit, ViewChild, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgramAdminCacheService } from '../../services/program-admin/program-admin-cache.service';
import { AddProgramAdminCommand, RemoveProgramAdminCommand } from '../../implementation/program-admin-menu-commands';

@Component({
  selector: 'ms-program-admin-list',
  templateUrl: './program-admin-list.component.html',
  styleUrls: ['./program-admin-list.component.scss']
})
export class ProgramAdminListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              public programAdminCacheService: ProgramAdminCacheService) {
    console.log('Constructing ProgramAdminListComponent', programAdminCacheService);
  }

  ngOnInit(): void {
    console.log('Establishing datasource with school id', this.schoolId);
    this.programAdminCacheService.establishDatasource(this.schoolId);
    this.programAdminCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding program admin list menus');
    ProgramAdminListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.programAdminCacheService, 
      this.schoolId);
  }

  ngAfterViewInit(): void {
    this.programAdminCacheService.sort = this.sort;
    this.programAdminCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'firstName', 'lastName'];
    } else {
      return ['select', 'firstName', 'lastName', 'email', 'homePhone', 'cellPhone'];
    }
  }

}

class ProgramAdminListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  programAdminCacheSerice: ProgramAdminCacheService,
                  schoolId: string) {
  menuState.add(new AddProgramAdminCommand('Add Program Admin', dialog, snackBar, schoolId));
  menuState.add(new RemoveProgramAdminCommand(
      'Remove Program Admin(s)',
      router,
      dialog,
      snackBar,
      null,
      () => programAdminCacheSerice.removeSelected(),
      () => {},
      () => programAdminCacheSerice.selection.selected.length > 0));
  }

}
