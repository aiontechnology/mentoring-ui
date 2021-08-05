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

import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Grade } from 'src/app/modules/shared/types/grade';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameRepositoryService } from 'src/app/modules/shared/services/resources/game-repository.service';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { Game } from 'src/app/modules/shared/models/game/game';
import { resourceGrades } from 'src/app/modules/shared/constants/resourceGrades';
import { Observable } from 'rxjs';
import { resourceLocations } from 'src/app/modules/shared/constants/locations';

@Component({
  selector: 'ms-game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss']
})
export class GameDialogComponent implements OnInit {

  model: FormGroup;
  isUpdate = false;

  grades: Grade[] = resourceGrades;
  locations: { [key: string]: string };
  activityFocusList$: Observable<string[]>;
  leadershipSkillList$: Observable<string[]>;
  leadershipTraitList$: Observable<string[]>;

  gradeRangeValidator = (control: AbstractControl): {[key: string]: boolean} => {
    const grade1 = control.get('grade1');
    const grade2 = control.get('grade2');
    if (!grade1 || !grade2) {
      return null;
    }
    return (grade1.value > grade2.value) ? { invalidRange: true } : null;
  }

  constructor(private dialogRef: MatDialogRef<GameDialogComponent>,
              private gameService: GameRepositoryService,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.locations = resourceLocations;

  }

  ngOnInit(): void {

    this.metaDataService.loadActivityFocuses();
    this.activityFocusList$ = this.metaDataService.activityFocuses;

    this.metaDataService.loadLeadershipSkills();
    this.leadershipSkillList$ = this.metaDataService.leadershipSkills;

    this.metaDataService.loadLeadershipTraits();
    this.leadershipTraitList$ = this.metaDataService.leadershipTraits;

  }

  save(): void {

    const newGame = new Game(this.model.value);
    let value: Promise<Game>;

    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newGame.links = this.model.value.game.links;
      value = this.gameService.updateGame(newGame);
    } else {
      value = this.gameService.createGame(newGame);
    }

    value.then((g: Game) => {
      this.dialogRef.close(g);
    });

  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
  }

  private createModel(formBuilder: FormBuilder, game: Game): FormGroup {
    const formGroup: FormGroup = formBuilder.group({
      game,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      gradeRange: formBuilder.group({
        grade1: ['', Validators.required],
        grade2: ['', Validators.required]
      }, { validator: this.gradeRangeValidator }),
      location: ['OFFLINE', Validators.required],
      activityFocuses: [],
      leadershipSkills: [],
      leadershipTraits: []
    });
    if (this.isUpdate) {
      formGroup.setValue({
        game,
        name: game?.name,
        gradeRange: {
          grade1: game?.grade1?.toString(),
          grade2: game?.grade2?.toString()
        },
        location: game?.location?.toString(),
        activityFocuses: game?.activityFocuses,
        leadershipSkills: game?.leadershipSkills,
        leadershipTraits: game?.leadershipTraits
      });
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
