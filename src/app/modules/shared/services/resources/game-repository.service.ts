/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { Game } from '../../models/game/game';

@Injectable()
export class GameRepositoryService extends BaseRepository<Game> {

  constructor(http: HttpClient) {
    super('/api/v1/games', http);
  }

  createGame(game: Game): Promise<Game> {
    return super.create(this.uriBase, game);
  }

  readAllGames(): void {
    return super.readAll(this.uriBase);
  }

  updateGame(game: Game): Promise<Game> {
    return super.update(this.uriBase, game);
  }

  deleteGames(games: Game[]) {
    return super.delete(games);
  }

  protected fromJSON(json: any): Game {
    return new Game(json);
  }

  protected newItem(): Game {
    return new Game();
  }

}
