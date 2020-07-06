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

import { Injectable } from '@angular/core';
import { DatasourceManager } from 'src/app/modules/school-manager/services/datasource-manager';
import { Game } from '../../models/game/game';
import { GameService } from './game.service';

@Injectable()
export class GameCacheService extends DatasourceManager<Game> {

  constructor(private gameService: GameService) {
    super();
  }

  establishDatasource(): void {
    this.elements = this.gameService.games;
    this.gameService.loadAll();
    this.elements.subscribe(g => {
      console.log('Creating new game datasource');
      this.dataSource.data = g;
    });
  }

  protected doRemoveItem(items: Game[]): void {
    this.gameService.removeGames(items);
  }

}
