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

import { Component, OnInit, AfterContentInit } from '@angular/core';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewBookDialogCommand, NewGameDialogCommand } from '../../implementation/resource-menu-commands';

@Component({
  selector: 'ms-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit, AfterContentInit {

  constructor(private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {
    }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    ResourceListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar);
  }

}

class ResourceListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar) {
    console.log('Constructing MenuHandler');
    menuState.add(new NewBookDialogCommand('Create New Book', router, dialog, snackBar));
    menuState.add(new NewGameDialogCommand('Create New Game', router, dialog, snackBar));
  }

}
