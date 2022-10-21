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
import {Game} from 'src/app/implementation/models/game/game';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../implementation/command/command';
import {AbstractDetailComponent} from '../../../../implementation/component/abstract-detail-component';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {GAME_ID} from '../../../../implementation/route/route-constants';
import {GAME_DETAIL_MENU, GAME_SINGLE_CACHE} from '../../providers/game-providers-factory';

@Component({
  selector: 'ms-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent extends AbstractDetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(GAME_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    // other
    @Inject(GAME_SINGLE_CACHE) public gameCache: SingleItemCache<Game>,
  ) {
    super(menuState, menuCommands, route)
    menuState.clear()
  }

  get gradeRangeDisplay(): string {
    let grades = resourceGrades[this.gameCache.item?.grade1 - 1]?.valueView;
    if (resourceGrades[this.gameCache.item?.grade2 - 1]?.valueView) {
      grades += ` - ${resourceGrades[this.gameCache.item?.grade2 - 1]?.valueView}`;
    }
    return grades;
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleRoute(route: ActivatedRoute) {
    route.paramMap
      .subscribe(params => {
        this.gameCache.fromId(params.get(GAME_ID));
      })
  }

  protected registerMenus(menuState: MenuStateService, menuCommands: { name: string; factory: (isAdminOnly: boolean) => Command }[]) {
    menuCommands.forEach(command => {
      menuState.add(command.factory(false))
    })
  }
}
