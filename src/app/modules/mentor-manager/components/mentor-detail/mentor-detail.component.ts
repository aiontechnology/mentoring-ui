/*
 * Copyright 2021-2024 Aion Technology LLC
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
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {DialogManager} from '../../../../implementation/command/dialog-manager';
import {MenuDialogCommand} from '../../../../implementation/command/menu-dialog-command';
import {SchoolWatchingDetailComponent} from '../../../../implementation/component/school-watching-detail-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {NavigationService} from '../../../../implementation/route/navigation.service';
import {RouteElementWatcher} from '../../../../implementation/route/route-element-watcher.service';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {Mentor} from '../../../../models/mentor/mentor';
import {School} from '../../../../models/school/school';
import {SchoolSession} from '../../../../models/school/schoolsession';
import {
  MENTOR_DATA_SOURCE,
  MENTOR_INSTANCE_CACHE,
  MENTOR_ROUTE_WATCHER
} from '../../../../providers/global/global-mentor-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../providers/global/global-school-session-providers-factory';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {MENTOR_GROUP} from '../../mentor-manager.module';
import {
  EDIT_MENU_TITLE,
  EDIT_PANEL_TITLE,
  EDIT_SNACKBAR_MESSAGE,
  PLURAL,
  REMOVE_MENU_TITLE,
  REMOVE_SNACKBAR_MESSAGE,
  SINGULAR
} from '../../other/mentor-constants';
import {MENTOR_DETAIL_DELETE_DIALOG_MANAGER, MENTOR_DETAIL_EDIT_DIALOG_MANAGER} from '../../providers/mentor-providers-factory';
import {MentorDialogComponent} from '../mentor-dialog/mentor-dialog.component';

@Component({
  selector: 'ms-mentor-detail',
  templateUrl: './mentor-detail.component.html',
  styleUrls: ['./mentor-detail.component.scss'],
})
export class MentorDetailComponent extends SchoolWatchingDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []

  constructor(
    // for super
    menuState: MenuStateService,
    route: ActivatedRoute,
    navService: NavigationService,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    // other
    @Inject(MENTOR_DETAIL_EDIT_DIALOG_MANAGER) private mentorEditDialogManager: DialogManager<MentorDialogComponent>,
    @Inject(MENTOR_DETAIL_DELETE_DIALOG_MANAGER) private mentorDeleteDialogManager: DialogManager<ConfirmationDialogComponent>,
    @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
    @Inject(MENTOR_INSTANCE_CACHE) public mentorInstanceCache: SingleItemCache<Mentor>,
    @Inject(MENTOR_ROUTE_WATCHER) private mentorRouteWatcher: RouteElementWatcher<Mentor>,
    private router: Router,
  ) {
    super(menuState, route, schoolInstanceCache, schoolSessionInstanceCache, navService)
  }

  protected get menus(): MenuDialogCommand<any>[] {
    return [
      MenuDialogCommand
        .builder(EDIT_MENU_TITLE, MENTOR_GROUP, this.mentorEditDialogManager)
        .withSnackbarMessage(EDIT_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.mentorInstanceCache.item,
          panelTitle: EDIT_PANEL_TITLE
        }))
        .build(),
      MenuDialogCommand
        .builder(REMOVE_MENU_TITLE, MENTOR_GROUP, this.mentorDeleteDialogManager)
        .withSnackbarMessage(REMOVE_SNACKBAR_MESSAGE)
        .withDataSupplier(() => ({
          model: this.mentorInstanceCache.item,
          singularName: SINGULAR,
          pluralName: PLURAL,
          nameSupplier: () => [this.mentorInstanceCache.item.fullName],
        }))
        .build()
    ]
  }

  ngOnInit() {
    this.menuState.reset()
    this.init()
    this.subscriptions.push(this.mentorRouteWatcher.watch(this.route))
  }

  ngOnDestroy(): void {
    this.destroy()
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  protected doHandleBackButton = (navService: NavigationService): void =>
    navService.push({routeSpec: ['/mentormanager', 'schools', this.schoolInstanceCache.item.id], fragment: undefined})

  protected onSchoolChange(school: School) {
    this.router.navigate(['mentormanager', 'schools', school.id])
  }
}
