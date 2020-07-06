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
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game } from '../../models/game/game';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GameService {

  private gameUri = environment.apiUri + '/api/v1/games';

  private _games: BehaviorSubject<Game[]>;

  private dataStore: {
    games: Game[];
  };

  constructor(private http: HttpClient) {
    this._games = new BehaviorSubject<Game[]>([]);
    this.dataStore = { games: [] };
  }

  get games(): Observable<Game[]> {
    return this._games;
  }

  addGame(game: Game): Promise<Game> {
    console.log('Adding game', game);
    return new Promise((resolver, reject) => {
      this.http.post(this.gameUri, this.stripLinks(game))
        .subscribe(data => {
          const g = data as Game;
          this.dataStore.games.push(g);
          this.publishGames();
          resolver(g);
        }, error => {
          console.error('Failed to create book');
        });
    });
  }

  loadAll(): void {
    this.http.get<any>(this.gameUri)
      .subscribe(data => {
        this.dataStore.games = data?._embedded?.gameModelList || [];
        this.logCache();
        this.publishGames();
      }, error => {
        console.error('Failed to fetch games');
      });
  }

  updateGame(game: Game): Promise<Game> {
    console.log('Updating game: ', game);
    return new Promise((resolver, reject) => {
      this.http.put(game._links.self[0].href, this.stripLinks(game))
        .subscribe(data => {
          console.log('Recieved back: ', data);
          const g = data as Game;
          for (const index in this.dataStore.games) {
            if (this.dataStore.games[index].name === g.name) {
              console.log('Replacing game: ', this.dataStore.games[index], g);
              this.dataStore.games[index] = g;
              break;
            }
          }
          this.publishGames();
          resolver(g);
        }, error => {
          console.error('Failed to update book');
        });
    });
  }

  private logCache(): void {
    for (const game of this.dataStore.games) {
      console.log('Cache entry (game)', game);
    }
  }

  private publishGames() {
    this._games.next(Object.assign({}, this.dataStore).games);
  }

  private stripLinks(game: Game): Game {
    const g = Object.assign({}, game);
    g._links = undefined;
    return g;
  }

}
