/**
 * Copyright 2021 Aion Technology LLC
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

import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { Game } from 'src/app/modules/shared/models/game/game';
import { GameRepositoryService } from 'src/app/modules/shared/services/resources/game-repository.service';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { GameDialogComponent } from '../game-dialog/game-dialog.component';
import { Subscription } from 'rxjs';
import { resourceGrades } from 'src/app/modules/shared/constants/resourceGrades';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'ms-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnDestroy {

  private subscriptions$: Subscription;
  private gameId: string;

  game: Game;

  constructor(route: ActivatedRoute,
              private userSession: UserSessionService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private gameService: GameRepositoryService,
              private snackBar: MatSnackBar,
              private router: Router) {

    this.subscriptions$ = new Subscription();

    const subscription1$ = route.paramMap.subscribe(
      params => {
        this.gameId = params.get('id');
      }
    );

    this.gameService.readOneGame(this.gameId);
    const subscription2$ = this.gameService.games.subscribe(() => {

      this.menuState.removeGroup('game');

      this.game = this.gameService.getGameById(this.gameId);

      if (this.userSession.isSysAdmin) {
        console.log('Adding game detail menus');
        GameDetailMenuManager.addMenus(this.game,
                                       this.menuState,
                                       this.router,
                                       this.dialog,
                                       this.snackBar,
                                       this.gameService);
      }

    });

    this.subscriptions$.add(subscription1$);
    this.subscriptions$.add(subscription2$);

  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.menuState.clear();
  }

  get gradeRangeDisplay(): string {
    let grades = resourceGrades[this.game?.grade1 - 1]?.valueView;
    if (resourceGrades[this.game?.grade2 - 1]?.valueView) {
      grades += ` - ${resourceGrades[this.game?.grade2 - 1]?.valueView}`;
    }
    return grades;
  }

}

class GameDetailMenuManager {

  static addMenus(game: Game,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  gameService: GameRepositoryService) {
    menuState.add(new EditDialogCommand(
      'Edit Game',
      'game',
      GameDialogComponent,
      'Game updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({ model: game }),
      () => { },
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
      () => gameService.deleteGames([game]),
      () => true));
  }

}
