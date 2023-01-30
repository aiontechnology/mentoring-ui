/*
 * Copyright 2020-2023 Aion Technology LLC
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
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable()
export class MetaDataService {

  private acctivityFocusesUri = environment.apiUri + '/api/v1/activityfocuses';
  private leadershipTraitsUri = environment.apiUri + '/api/v1/leadership_traits';
  private leadershipSkillsUri = environment.apiUri + '/api/v1/leadership_skills';
  private phonogramUri = environment.apiUri + '/api/v1/phonograms';
  private behaviorUri = environment.apiUri + '/api/v1/behaviors';
  private tagsUri = environment.apiUri + '/api/v1/tags';

  constructor(private http: HttpClient) {
    this._activityFocuses = new Subject<string[]>();
    this._leadershipTraits = new Subject<string[]>();
    this._leadershipSkills = new Subject<string[]>();
    this._phonograms = new Subject<string[]>();
    this._behaviors = new Subject<string[]>();
    this._tags = new Subject<string[]>();
  }

  private _activityFocuses: Subject<string[]>;

  get activityFocuses(): Observable<string[]> {
    return this._activityFocuses;
  }

  private _leadershipTraits: Subject<string[]>;

  get leadershipTraits(): Observable<string[]> {
    return this._leadershipTraits;
  }

  private _leadershipSkills: Subject<string[]>;

  get leadershipSkills(): Observable<string[]> {
    return this._leadershipSkills;
  }

  private _phonograms: Subject<string[]>;

  get phonograms(): Observable<string[]> {
    return this._phonograms;
  }

  private _behaviors: Subject<string[]>;

  get behaviors(): Observable<string[]> {
    return this._behaviors;
  }

  private _tags: Subject<string[]>;

  get tags(): Observable<string[]> {
    return this._tags;
  }

  loadActivityFocuses(): Promise<string[]> {
    return this.http.get<any>(this.acctivityFocusesUri)
      .pipe(
        map(data => {
        const activityFocuses = data?.content ?? []
        this._activityFocuses.next(activityFocuses)
        return activityFocuses
      }))
      .toPromise()
  }

  loadLeadershipTraits(): Promise<string[]> {
    return this.http.get<any>(this.leadershipTraitsUri)
      .pipe(
        map(data => {
          const leadershipTraits = data?.content ?? [];
          this._leadershipTraits.next(leadershipTraits);
          return leadershipTraits
        }))
      .toPromise()
  }

  loadLeadershipSkills(): Promise<string[]> {
    return this.http.get<any>(this.leadershipSkillsUri)
      .pipe(
        map(data => {
          const leadershipSkills = data?.content ?? [];
          this._leadershipSkills.next(leadershipSkills);
          return leadershipSkills
        }))
      .toPromise()
  }

  loadPhonograms(): void {
    this.http.get<any>(this.phonogramUri)
      .subscribe(data => {
        const phonograms = data?.content ?? [];
        this._phonograms.next(phonograms);
      });
  }

  loadBehaviors(): Promise<string[]> {
    return this.http.get<any>(this.behaviorUri)
      .pipe(
        map(data => {
          const behaviors = data?.content ?? [];
          this._behaviors.next(behaviors);
          return behaviors
        }))
      .toPromise()
  }

  loadTags(): void {
    this.http.get<any>(this.tagsUri)
      .subscribe(data => {
        const tags = data?.content ?? [];
        this._tags.next(tags);
      });
  }

}
