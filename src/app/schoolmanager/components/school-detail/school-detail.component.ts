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

import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolService } from '../../services/school/school.service';
import { School } from '../../models/school/school';
import { TeacherListComponent } from '../teacher-list/teacher-list.component';
import { MenuReceiver } from '../../implementation/menu-receiver';
import { EditSchoolDialogCommand, RemoveSchoolCommand } from '../../implementation/school-menu-commands';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuHandler } from '../../implementation/menu-handler';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit, AfterViewInit {

  school: School;
  schoolId: string;

  menuHandler: SchoolDetailMenuHandler;

  @ViewChild(TeacherListComponent) teacherList: TeacherListComponent;

  constructor(private route: ActivatedRoute,
              private schoolService: SchoolService,
              router: Router,
              dialog: MatDialog,
              snackBar: MatSnackBar) {
    route.paramMap.subscribe(
      params => {
        this.schoolId = params.get('id');
      }
    );
    this.menuHandler = new SchoolDetailMenuHandler(router, dialog, snackBar, schoolService);
  }

  ngOnInit(): void {
    this.schoolService.loadAll();
    this.schoolService.schools.subscribe(s => {
      this.school = this.schoolService.findById(this.schoolId);
      this.menuHandler.school = this.school;
    });
  }

  ngAfterViewInit(): void {
    console.log('SchoolDetailComponent: ngAfterViewInit()');
    this.menuHandler.sendMenusToParent();
  }

}

class SchoolDetailMenuHandler extends MenuHandler {

  school: School;

  private parent: MenuReceiver;

  constructor(router: Router, dialog: MatDialog, snackBar: MatSnackBar, schoolService: SchoolService) {
    super();
    this.currentMenus.set('edit-school', new EditSchoolDialogCommand(
      'Edit School',
      router,
      dialog,
      snackBar,
      () => this.school,
      () => {},
      () => true
    ));
    this.currentMenus.set('remove-school', new RemoveSchoolCommand(
      'Remove School',
      router,
      dialog,
      snackBar,
      '/schoolmanager',
      () => schoolService.removeSchools([this.school]),
      () => {},
      () => true
    ));
  }

  receiveMenuHandlers(menuHandler: MenuHandler) {
    console.log('Received menu handler', menuHandler);
    this.currentMenus = this.joinWith(menuHandler);
    console.log('New menus', this.currentMenus);
  }

  sendMenusToParent() {
    console.log('Sending menus to parent', this.currentMenus);
    this.parent.setMenus(this.currentMenus);
  }

  set parant(parent: MenuReceiver) {
    console.log('Setting parent', parent);
    this.parent = parent;
  }

}
