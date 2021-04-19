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

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { InterestOutbound } from '../../models/meta-data/interests/interest-outbound';

@Injectable()
export class MetaDataService {

  private acctivityFocusesUri = environment.apiUri + '/api/v1/activityfocuses';
  private interestsUri = environment.apiUri + '/api/v1/interests';
  private leadershipTraitsUri = environment.apiUri + '/api/v1/leadership_traits';
  private leadershipSkillsUri = environment.apiUri + '/api/v1/leadership_skills';
  private phonogramUri = environment.apiUri + '/api/v1/phonograms';
  private behaviorUri = environment.apiUri + '/api/v1/behaviors';
  private tagsUri = environment.apiUri + '/api/v1/tags';

  private _activityFocuses: Subject<string[]>;
  private _leadershipTraits: Subject<string[]>;
  private _leadershipSkills: Subject<string[]>;
  private _phonograms: Subject<string[]>;
  private _behaviors: Subject<string[]>;
  private _tags: Subject<string[]>;
  private _interests: ReplaySubject<string[]>;

  constructor(private http: HttpClient) {
    this._activityFocuses = new Subject<string[]>();
    this._leadershipTraits = new Subject<string[]>();
    this._leadershipSkills = new Subject<string[]>();
    this._phonograms = new Subject<string[]>();
    this._behaviors = new Subject<string[]>();
    this._tags = new Subject<string[]>();
    this._interests = new ReplaySubject<string[]>(1);
  }

  get activityFocuses(): Observable<string[]> {
    return this._activityFocuses;
  }

  get leadershipTraits(): Observable<string[]> {
    return this._leadershipTraits;
  }

  get leadershipSkills(): Observable<string[]> {
    return this._leadershipSkills;
  }

  get phonograms(): Observable<string[]> {
    return this._phonograms;
  }

  get behaviors(): Observable<string[]> {
    return this._behaviors;
  }

  get tags(): Observable<string[]> {
    return this._tags;
  }

  get interests(): Observable<string[]> {
    return this._interests;
  }

  loadActivityFocuses(): void {
    this.http.get<any>(this.acctivityFocusesUri)
      .subscribe(data => {
        const activityFocuses = data?._embedded?.stringList ?? [];
        this._activityFocuses.next(activityFocuses);
        this.logCache('activity focus', activityFocuses);
      });
  }

  loadLeadershipTraits(): void {
    this.http.get<any>(this.leadershipTraitsUri)
      .subscribe(data => {
        const leadershipTraits = data?._embedded?.stringList ?? [];
        this._leadershipTraits.next(leadershipTraits);
        this.logCache('leadership trait', leadershipTraits);
      });
  }

  loadLeadershipSkills(): void {
    this.http.get<any>(this.leadershipSkillsUri)
      .subscribe(data => {
        const leadershipSkills = data?._embedded?.stringList ?? [];
        this._leadershipSkills.next(leadershipSkills);
        this.logCache('leadership skill', leadershipSkills);
      });
  }

  loadPhonograms(): void {
    this.http.get<any>(this.phonogramUri)
      .subscribe(data => {
        const phonograms = data?._embedded?.stringList ?? [];
        this._phonograms.next(phonograms);
        this.logCache('phonogram', phonograms);
      });
  }

  loadBehaviors(): void {
    this.http.get<any>(this.behaviorUri)
      .subscribe(data => {
        const behaviors = data?._embedded?.stringList ?? [];
        this._behaviors.next(behaviors);
        this.logCache('behavior', behaviors);
      });
  }

  loadTags(): void {
    this.http.get<any>(this.tagsUri)
      .subscribe(data => {
        const tags = data?._embedded?.stringList ?? [];
        this._tags.next(tags);
        this.logCache('tag', tags);
      });
  }

  loadInterests(): void {
    this.http.get<any>(this.interestsUri)
      .subscribe(data => {
        const interests = data?._embedded?.stringList ?? [];
        this._interests.next(interests);
        this.logCache('interest', interests);
      });
  }

  updateInterests(newInterest: InterestOutbound): Promise<string[]> {
    console.log('Updating interest', newInterest);
    return new Promise((resolver) => {
      this.http.put<any>(this.interestsUri, newInterest)
        .subscribe(data => {
          console.log('Recieved interest list:', data);
          const interests = data?._embedded?.stringList ?? [];
          this._interests.next(interests);
          resolver(interests);
        });
    });
  }

  private logCache(type: string, values: string[]): void {
    for (const value of values) {
      console.log(`Cache entiry (${type})`, value);
    }
  }

}
