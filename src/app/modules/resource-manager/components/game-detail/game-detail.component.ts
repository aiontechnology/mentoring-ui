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
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {Game} from 'src/app/modules/shared/models/game/game';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {GameDialogComponent} from '../game-dialog/game-dialog.component';
import {resourceGrades} from 'src/app/modules/shared/constants/resourceGrades';
import {UserSessionService} from 'src/app/services/user-session.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {DataSource} from '../../../../implementation/data/data-source';
import {GameCacheService} from '../../services/resources/game-cache.service';
import {GAME_DATA_SOURCE} from '../../../shared/shared.module';

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
              private gameCacheService: GameCacheService,
              private userSession: UserSessionService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private snackBar: MatSnackBar,
              private router: Router,
              private navigation: NavigationService) {
  }

  get gradeRangeDisplay(): string {
    let grades = resourceGrades[this.game?.grade1 - 1]?.valueView;
    if (resourceGrades[this.game?.grade2 - 1]?.valueView) {
      grades += ` - ${resourceGrades[this.game?.grade2 - 1]?.valueView}`;
    }
    return grades;
  }

  ngOnInit(): void {
    this.navigation.routeParams = ['resourcemanager'];
    this.navigation.fragment = 'games';

    /* Watch the game UUID. Call event handler when it changes */
    this.route.paramMap
      .subscribe(params => this.onGameIdChange(params.get('id')));

    this.setMenu();
  }

  ngOnDestroy(): void {
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  private setMenu = (): void => {
    this.menuState.removeGroup('game');
    if (this.userSession.isSysAdmin) {
      GameDetailMenuManager.addMenus(this,
        this.menuState,
        this.router,
        this.dialog,
        this.snackBar,
        this.gameDataSource,
        this.gameCacheService);
    }
  }

  /**
   * Handle game ID changes.
   * @param gameId The ID of the current game.
   */
  private onGameIdChange = (gameId: string): void => {
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

class GameDetailMenuManager {
  static addMenus(component: GameDetailComponent,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  gameDataSource: DataSource<Game>,
                  gameCacheService: GameCacheService) {
    menuState.add(new EditDialogCommand(
      'Edit Game',
      'game',
      GameDialogComponent,
      'Game updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({model: component.game}),
      (game: Game) => component.game = game,
      () => true));
    menuState.add(new DeleteDialogCommand(
      'Remove Game',
      'game',
      ConfimationDialogComponent,
      'Game(s) removed',
      'game',
      'games',
      router,
      dialog,
      snackBar,
      '/resourcemanager',
      () => 1,
      () => gameDataSource.remove(component.game)
        .then(() => gameCacheService.loadData()),
      () => true));
  }

}
