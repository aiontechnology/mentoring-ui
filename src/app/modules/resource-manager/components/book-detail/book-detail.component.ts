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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {resourceGrades} from 'src/app/implementation/constants/resourceGrades';
import {Book} from 'src/app/implementation/models/book/book';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {DetailComponent} from '../../../../implementation/component/detail-component';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {BOOK_ID} from '../../../../implementation/route/route-constants';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {SingleItemCacheUpdater} from '../../../../implementation/state-management/single-item-cache-updater';
import {BOOK_INSTANCE_CACHE, BOOK_INSTANCE_CACHE_UPDATER} from '../../../../providers/global/global-book-providers-factory';
import {ConfimationDialogComponent} from '../../../shared/components/confimation-dialog/confimation-dialog.component';
import {
  EDIT_BOOK_MENU_TITLE,
  EDIT_BOOK_PANEL_TITLE,
  EDIT_BOOK_SNACKBAR_MESSAGE,
  PLURAL_BOOK,
  REMOVE_BOOK_MENU_TITLE,
  REMOVE_BOOK_SNACKBAR_MESSAGE,
  SINGULAR_BOOK
} from '../../other/resource-constants';
import {BOOK_DETAIL_DELETE_DIALOG_MANAGER, BOOK_DETAIL_EDIT_DIALOG_MANAGER} from '../../providers/book-providers-factory';
import {BOOK_GROUP} from '../../resource-manager.module';
import {BookDialogComponent} from '../book-dialog/book-dialog.component';

@Component({
  selector: 'ms-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent extends DetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    route: ActivatedRoute,
    navService: NavigationService,
    // other
    @Inject(BOOK_DETAIL_EDIT_DIALOG_MANAGER) private bookEditDialogManager: DialogManager<BookDialogComponent>,
    @Inject(BOOK_DETAIL_DELETE_DIALOG_MANAGER) private bookDeleteDialogManager: DialogManager<ConfimationDialogComponent>,
    @Inject(BOOK_INSTANCE_CACHE) public bookInstanceCache: SingleItemCache<Book>,
    @Inject(BOOK_INSTANCE_CACHE_UPDATER) private bookInstanceCacheUpdater: SingleItemCacheUpdater<Book>,
  ) {
    super(menuState, route, navService)
    menuState.reset()
  }

  get resourceGrades() {
    return resourceGrades;
  }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand<BookDialogComponent>.builder(EDIT_BOOK_MENU_TITLE, BOOK_GROUP, this.bookEditDialogManager)
        .withSnackbarMessage(EDIT_BOOK_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.bookInstanceCache.item,
          panelTitle: EDIT_BOOK_PANEL_TITLE
        }))
        .build(),
      MenuDialogCommand<ConfimationDialogComponent>.builder(REMOVE_BOOK_MENU_TITLE, BOOK_GROUP, this.bookDeleteDialogManager)
        .withSnackbarMessage(REMOVE_BOOK_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.bookInstanceCache.item,
          singularName: SINGULAR_BOOK,
          pluralName: PLURAL_BOOK,
          countSupplier: () => 1,
        }))
        .build()
    ]
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected override handleRoute = async (route: ActivatedRoute): Promise<void> => {
    await route.paramMap
      .subscribe(params => {
        this.bookInstanceCacheUpdater.fromId(params.get(BOOK_ID));
      })
  }
}
