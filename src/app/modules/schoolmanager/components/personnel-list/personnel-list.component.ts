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

import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonnelCacheService } from '../../services/personnel/personnel-cache.service';
import { AddPersonnelCommand, RemovePersonnelCommand } from '../../implementation/personnel-menu-command';

@Component({
  selector: 'ms-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() schoolId: string;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              public personnelCacheService: PersonnelCacheService) {
    console.log('Constructing PersonnelListComponent', PersonnelCacheService);
  }

  ngOnInit(): void {
    console.log('Establishing datasource with school id', this.schoolId);
    this.personnelCacheService.establishDatasource(this.schoolId);
    this.personnelCacheService.clearSelection();
  }

  ngAfterContentInit(): void {
    console.log('Adding personnel list menus');
    PersonnelMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.personnelCacheService,
      this.schoolId);
  }

  ngAfterViewInit(): void {
    this.personnelCacheService.sort = this.sort;
    this.personnelCacheService.paginator = this.paginator;
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'type', 'firstName', 'lastName'];
    } else {
      return ['select', 'type', 'firstName', 'lastName', 'email', 'workPhone', 'cellPhone'];
    }
  }

}

class PersonnelMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  personnelCacheService: PersonnelCacheService,
                  schoolId: string) {
    menuState.add(new AddPersonnelCommand('Add Personnel', dialog, snackBar, schoolId));
    menuState.add(new RemovePersonnelCommand(
      'Remove Personnel',
      router,
      dialog,
      snackBar,
      null,
      () => personnelCacheService.selectionCount,
      () => personnelCacheService.removeSelected(),
      () => { },
      () => personnelCacheService.selection.selected.length > 0));
  }

}
