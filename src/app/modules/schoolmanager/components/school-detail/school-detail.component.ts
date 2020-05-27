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

import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolService } from '../../services/school/school.service';
import { School } from '../../models/school/school';
import { EditSchoolDialogCommand, RemoveSchoolCommand } from '../../implementation/school-menu-commands';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuStateService } from 'src/app/services/menu-state.service';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit, AfterContentInit, AfterViewInit {

  school: School;
  schoolId: string;

  constructor(route: ActivatedRoute,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private schoolService: SchoolService,
              private snackBar: MatSnackBar,
              private router: Router) {
    route.paramMap.subscribe(
      params => {
        this.schoolId = params.get('id');
      }
    );
  }

  ngOnInit(): void {
    this.schoolService.loadAll();
    this.schoolService.schools.subscribe(s => {
      this.school = this.schoolService.findById(this.schoolId);
     });
  }

  ngAfterContentInit(): void {
    console.log('Adding school detail menus');
    this.menuState.clear();
    SchoolDetailMenuManager.addMenus(this.school, this.menuState, this.router, this.dialog, this.snackBar, this.schoolService);
  }

  ngAfterViewInit(): void {
    this.onIndexChange(0);
  }

  onIndexChange(index: number): void {
    console.log('Tab change', index, this.menuState.activeMenus);
    this.menuState.makeAllVisible();
    switch (index) {
      case 0:
        this.menuState.makeGroupInvisible('teacher');
        this.menuState.makeGroupInvisible('program-admin');
        break;
     case 1:
        this.menuState.makeGroupInvisible('program-admin');
        break;
      case 2:
        this.menuState.makeGroupInvisible('teacher');
    }
  }

}

class SchoolDetailMenuManager {

  static addMenus(school: School,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  schoolService: SchoolService) {
    menuState.add(new EditSchoolDialogCommand(
      'Edit School',
      router,
      dialog,
      snackBar,
      () => school,
      () => {},
      () => true
    ));
    menuState.add(new RemoveSchoolCommand(
      'Remove School',
      router,
      dialog,
      snackBar,
      '/schoolmanager',
      () => schoolService.removeSchools([school]),
      () => {},
      () => true
    ));
  }

}
