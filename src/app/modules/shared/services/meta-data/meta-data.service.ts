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
import { HttpClient } from '@angular/common/http';
import { Element } from '../../models/meta-data/element';
import { BehaviorSubject, Observable, VirtualTimeScheduler } from 'rxjs';

@Injectable()
export class MetaDataService {

  private acctivityFocusesUri = environment.apiUri + '/api/v1/activityfocuses';
  private interestsUri = environment.apiUri + '/api/v1/interests';
  private leadershipTraitsUri = environment.apiUri + '/api/v1/leadership_traits';
  private leadershipSkillsUri = environment.apiUri + '/api/v1/leadership_skills';
  private phonogramUri = environment.apiUri + '/api/v1/phonograms';
  private behaviorUri = environment.apiUri + '/api/v1/behaviors';

  private _activityFocuses: BehaviorSubject<Element[]>;
  private _interests: BehaviorSubject<Element[]>;
  private _leadershipTraits: BehaviorSubject<Element[]>;
  private _leadershipSkills: BehaviorSubject<Element[]>;
  private _phonograms: BehaviorSubject<Element[]>;
  private _behaviors: BehaviorSubject<Element[]>;

  private dataStore: {
    activityFocuses: Element[];
    interests: Element[];
    leadershipTraits: Element[];
    leadershipSkills: Element[];
    phonograms: Element[];
    behaviors: Element[];
  };

  constructor(private http: HttpClient) {
    this._activityFocuses = new BehaviorSubject<Element[]>([]);
    this._interests = new BehaviorSubject<Element[]>([]);
    this._leadershipTraits = new BehaviorSubject<Element[]>([]);
    this._leadershipSkills = new BehaviorSubject<Element[]>([]);
    this._phonograms = new BehaviorSubject<Element[]>([]);
    this._behaviors = new BehaviorSubject<Element[]>([]);
    this.dataStore = {
      activityFocuses: [],
      interests: [],
      leadershipTraits: [],
      leadershipSkills: [],
      phonograms: [],
      behaviors: []
    };
  }

  get activityFocuses(): Observable<Element[]> {
    return this._activityFocuses;
  }

  get interests(): Observable<Element[]> {
    return this._interests;
  }

  get leadershipTraits(): Observable<Element[]> {
    return this._leadershipTraits;
  }

  get leadershipSkills(): Observable<Element[]> {
    return this._leadershipSkills;
  }

  get phonograms(): Observable<Element[]> {
    return this._phonograms;
  }

  get behaviors(): Observable<Element[]> {
    return this._behaviors;
  }

  loadActivityFocuses(): void {
    this.http.get<any>(this.acctivityFocusesUri)
      .subscribe(data => {
        this.dataStore.activityFocuses = data?._embedded.activityFocusModelList || [];
        this.logCache('activity focus', this.dataStore.activityFocuses);
        this.publishActivityFocuses();
      })
  }

  loadInterests(): void {
    this.http.get<any>(this.interestsUri)
      .subscribe(data => {
        this.dataStore.interests = data?._embedded?.interestModelList || [];
        this.logCache('interest', this.dataStore.interests);
        this.publishInterests();
      });
  }

  loadLeadershipTraits(): void {
    this.http.get<any>(this.leadershipTraitsUri)
      .subscribe(data => {
        this.dataStore.leadershipTraits = data?._embedded?.leadershipTraitModelList || [];
        this.logCache('leadership trait', this.dataStore.leadershipTraits);
        this.publishLeadershipTraits();
      });
  }

  loadLeadershipSkills(): void {
    this.http.get<any>(this.leadershipSkillsUri)
      .subscribe(data => {
        this.dataStore.leadershipSkills = data?._embedded?.leadershipSkillModelList || [];
        this.logCache('leadership skill', this.dataStore.leadershipSkills);
        this.publishLeadershipSkills();
      });
  }

  loadPhonograms(): void {
    this.http.get<any>(this.phonogramUri)
      .subscribe(data => {
        this.dataStore.phonograms = data?._embedded?.phonogramModelList || [];
        this.logCache('phonogram', this.dataStore.phonograms);
        this.publishPhonograms();
      });
  }

  loadBehaviors(): void {
    this.http.get<any>(this.behaviorUri)
      .subscribe(data => {
        this.dataStore.behaviors = data?._embedded?.behaviorModelList || [];
        this.logCache('behavior', this.dataStore.behaviors);
        this.publishBehaviors();
      });
  }

  private logCache(type: string, values: Element[]): void {
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
