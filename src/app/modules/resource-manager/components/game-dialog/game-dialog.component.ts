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

import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Grade } from 'src/app/modules/shared/types/grade';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from '../../services/resources/game.service';
import { MetaDataService } from '../../services/meta-data/meta-data.service';
import { Element } from '../../models/meta-data/element';
import { Game } from '../../models/game/game';
import { grades } from 'src/app/modules/shared/constants/grades';

@Component({
  selector: 'ms-game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss']
})
export class GameDialogComponent {

  model: FormGroup;
  isUpdate = false;

  grades: Grade[] = grades;
  interestList: Element[];
  leadershipTraitList: Element[];
  leadershipSkillList: Element[];

  constructor(private dialogRef: MatDialogRef<GameDialogComponent>,
              private gameService: GameService,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.game);

    metaDataService.loadInterests();
    metaDataService.interests.subscribe(interests => {
      this.interestList = interests;
    });

    metaDataService.loadLeadershipTraits();
    metaDataService.leadershipTraits.subscribe(leadershipTraits => {
      this.leadershipTraitList = leadershipTraits;
    });

    metaDataService.loadLeadershipSkills();
    metaDataService.leadershipSkills.subscribe(leadershipSkills => {
      this.leadershipSkillList = leadershipSkills;
    });
  }

  save(): void {
    const newGame = this.model.value as Game;
    if (this.isUpdate) {

    } else {
      this.gameService.addGame(newGame).then(game => {
        this.dialogRef.close(game);
      });
    }
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, game: Game): FormGroup {
    return formBuilder.group({
      game,
      name: game?.name || '',
      description: game?.description || '',
      gradeLevel: game?.gradeLevel || '',
      interests: [],
      leadershipTraits: [],
      leadershipSkills: []
    });
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
