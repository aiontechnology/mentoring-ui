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

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SchoolResourceRepository} from '../school-resource-repository';
import {Game} from 'src/app/modules/shared/models/game/game';
import {Observable} from 'rxjs';

@Injectable()
export class SchoolGameRepositoryService extends SchoolResourceRepository<Game> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/games', http);
  }

  get schoolGames(): Observable<Game[]> {
    return this.resources;
  }

  readAllSchoolGames(schoolId: string): void {
    super.readAllResources(this.buildUri(schoolId));
  }

  updateSchoolGames(schoolId: string, games: string[]): void {
    super.updateResources(this.buildUri(schoolId), games);
  }

  protected fromJSON(json: object[]): Game[] {
    return json.map((g: object) => new Game(g));
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
