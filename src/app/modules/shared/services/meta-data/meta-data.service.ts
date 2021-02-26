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
import { BehaviorSubject, Observable } from 'rxjs';
import { InterestOutbound } from '../../models/meta-data/interests/interest-outbound';

@Injectable()
export class MetaDataService {

  private acctivityFocusesUri = environment.apiUri + '/api/v1/activityfocuses';
  private interestsUri = environment.apiUri + '/api/v1/interests';
  private leadershipTraitsUri = environment.apiUri + '/api/v1/leadership_traits';
  private leadershipSkillsUri = environment.apiUri + '/api/v1/leadership_skills';
  private phonogramUri = environment.apiUri + '/api/v1/phonograms';
  private behaviorUri = environment.apiUri + '/api/v1/behaviors';

  private _activityFocuses: BehaviorSubject<string[]>;
  private _interests: BehaviorSubject<string[]>;
  private _leadershipTraits: BehaviorSubject<string[]>;
  private _leadershipSkills: BehaviorSubject<string[]>;
  private _phonograms: BehaviorSubject<string[]>;
  private _behaviors: BehaviorSubject<string[]>;

  private dataStore: {
    activityFocuses: string[];
    interests: string[];
    leadershipTraits: string[];
    leadershipSkills: string[];
    phonograms: string[];
    behaviors: string[];
  };

  constructor(private http: HttpClient) {
    this._activityFocuses = new BehaviorSubject<string[]>([]);
    this._interests = new BehaviorSubject<string[]>([]);
    this._leadershipTraits = new BehaviorSubject<string[]>([]);
    this._leadershipSkills = new BehaviorSubject<string[]>([]);
    this._phonograms = new BehaviorSubject<string[]>([]);
    this._behaviors = new BehaviorSubject<string[]>([]);
    this.dataStore = {
      activityFocuses: [],
      interests: [],
      leadershipTraits: [],
      leadershipSkills: [],
      phonograms: [],
      behaviors: []
    };
  }

  get activityFocuses(): Observable<string[]> {
    return this._activityFocuses;
  }

  get interests(): Observable<string[]> {
    return this._interests;
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

  loadActivityFocuses(): void {
    this.http.get<any>(this.acctivityFocusesUri)
      .subscribe(data => {
        this.dataStore.activityFocuses = data?._embedded.stringList || [];
        this.logCache('activity focus', this.dataStore.activityFocuses);
        this.publishActivityFocuses();
      });
  }

  loadInterests(): void {
    this.http.get<any>(this.interestsUri)
      .subscribe(data => {
        this.dataStore.interests = data?._embedded?.stringList || [];
        this.logCache('interest', this.dataStore.interests);
        this.publishInterests();
      });
  }

  loadLeadershipTraits(): void {
    this.http.get<any>(this.leadershipTraitsUri)
      .subscribe(data => {
        this.dataStore.leadershipTraits = data?._embedded?.stringList || [];
        this.logCache('leadership trait', this.dataStore.leadershipTraits);
        this.publishLeadershipTraits();
      });
  }

  loadLeadershipSkills(): void {
    this.http.get<any>(this.leadershipSkillsUri)
      .subscribe(data => {
        this.dataStore.leadershipSkills = data?._embedded?.stringList || [];
        this.logCache('leadership skill', this.dataStore.leadershipSkills);
        this.publishLeadershipSkills();
      });
  }

  loadPhonograms(): void {
    this.http.get<any>(this.phonogramUri)
      .subscribe(data => {
        this.dataStore.phonograms = data?._embedded?.stringList || [];
        this.logCache('phonogram', this.dataStore.phonograms);
        this.publishPhonograms();
      });
  }

  loadBehaviors(): void {
    this.http.get<any>(this.behaviorUri)
      .subscribe(data => {
        this.dataStore.behaviors = data?._embedded?.stringList || [];
        this.logCache('behavior', this.dataStore.behaviors);
        this.publishBehaviors();
      });
  }

  updateInterests(newInterest: InterestOutbound): Promise<string[]> {
    console.log('Updating interest', newInterest);
    return new Promise((resolver) => {
      this.http.put<any>(this.interestsUri, newInterest)
        .subscribe(data => {
          console.log('Recieved interest list:', data);
          const i = data?._embedded?.stringList || [];
          this.dataStore.interests = i;
          this.publishInterests();
          resolver(i);
        });
    });
  }

  private logCache(type: string, values: string[]): void {
    for (const value of values) {
      console.log(`Cache entiry (${type})`, value);
    }
  }

  private publishActivityFocuses() {
    this._activityFocuses.next(Object.assign({}, this.dataStore).activityFocuses);
  }

  private publishInterests() {
    this._interests.next(Object.assign({}, this.dataStore).interests);
  }

  private publishLeadershipTraits() {
    this._leadershipTraits.next(Object.assign({}, this.dataStore).leadershipTraits);
  }

  private publishLeadershipSkills() {
    this._leadershipSkills.next(Object.assign({}, this.dataStore).leadershipSkills);
  }

  private publishPhonograms() {
    this._phonograms.next(Object.assign({}, this.dataStore).phonograms);
  }

  private publishBehaviors() {
    this._behaviors.next(Object.assign({}, this.dataStore).behaviors);
  }

}
