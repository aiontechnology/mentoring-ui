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
import {resourceGrades} from 'src/app/modules/shared/constants/resourceGrades';
import {Game} from 'src/app/modules/shared/models/game/game';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {UserSessionService} from 'src/app/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {GAME_DATA_SOURCE} from '../../../shared/shared.module';
import {GAME_DETAIL_MENU, GAME_SINGLE_CACHE} from '../../resource-manager.module';

@Component({
  selector: 'ms-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit, OnDestroy {
  game: Game;
  private gameId: string;

  constructor(private route: ActivatedRoute,
              @Inject(GAME_DATA_SOURCE) private gameDataSource: DataSource<Game>,
              private userSession: UserSessionService,
              private menuState: MenuStateService,
              private navigation: NavigationService,
              @Inject(GAME_SINGLE_CACHE) private singleItemCache: SingleItemCache<Game>,
              @Inject(GAME_DETAIL_MENU) private menuCommands: Command[]) {
  }

  get gradeRangeDisplay(): string {
    let grades = resourceGrades[this.game?.grade1 - 1]?.valueView;
    if (resourceGrades[this.game?.grade2 - 1]?.valueView) {
      grades += ` - ${resourceGrades[this.game?.grade2 - 1]?.valueView}`;
    }
    return grades;
  }

  ngOnInit(): void {
    this.menuState
      .clear()
      .add(this.menuCommands)

    this.navigation.routeParams = ['resourcemanager'];
    this.navigation.fragment = 'games';

    /* Watch the game UUID. Call event handler when it changes */
    this.route.paramMap
      .subscribe(params => this.onIdChange(params.get('id')));
  }

  ngOnDestroy(): void {
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  /**
   * Handle game ID changes.
   * @param gameId The ID of the current game.
   */
  private onIdChange = (gameId: string): void => {
    if (gameId) {
      this.gameId = gameId;
      this.gameDataSource.oneValue(this.gameId)
        .then(game => {
          this.game = game;
        });
    } else {
      throw new Error('Unable to set game id');
    }
  }
}
