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
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MetaDataService {

  private interestsUri = environment.apiUri + '/api/v1/interests';
  private leadershipTraitsUri = environment.apiUri + '/api/v1/leadership_traits';
  private leadershipSkillsUri = environment.apiUri + '/api/v1/leadership_skills';

  private _interests: BehaviorSubject<Element[]>;
  private _leadershipTraits: BehaviorSubject<Element[]>;
  private _leadershipSkills: BehaviorSubject<Element[]>;

  private dataStore: {
    interests: Element[];
    leadershipTraits: Element[];
    leadershipSkills: Element[];
  };

  constructor(private http: HttpClient) {
    this._interests = new BehaviorSubject<Element[]>([]);
    this._leadershipTraits = new BehaviorSubject<Element[]>([]);
    this._leadershipSkills = new BehaviorSubject<Element[]>([]);
    this.dataStore = { 
      interests: [],
      leadershipTraits: [],
      leadershipSkills: []
    };
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

  loadInterests(): void {
    this.http.get<any>(this.interestsUri)
      .subscribe(data => {
        this.dataStore.interests = data?._embedded?.interestModelList || [];
        this.logInterestCache();
        this.publishInterests();
      });
  }

  loadLeadershipTraits(): void {
    this.http.get<any>(this.leadershipTraitsUri)
      .subscribe(data => {
        this.dataStore.leadershipTraits = data?._embedded?.leadershipTraitModelList || [];
        this.logLeadershipTraitsCache();
        this.publishLeadershipTraits();
      });
  }

  loadLeadershipSkills(): void {
    this.http.get<any>(this.leadershipSkillsUri)
      .subscribe(data => {
        this.dataStore.leadershipSkills = data?._embedded?.leadershipSkillModelList || [];
        this.logLeadershipSkillsCache();
        this.publishLeadershipSkills();
      });
  }

  private logInterestCache(): void {
    for (const interest of this.dataStore.interests) {
      console.log('Cache entiry (interest)', interest);
    }
  }

  private logLeadershipTraitsCache(): void {
    for (const leadershipTrait of this.dataStore.leadershipTraits) {
      console.log('Cache entiry (leadership trait)', leadershipTrait);
    }
  }

  private logLeadershipSkillsCache(): void {
    for (const leadershipSkill of this.dataStore.leadershipSkills) {
      console.log('Cache entiry (leadership skill)', leadershipSkill);
    }
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

}
