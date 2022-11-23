/*
 * Copyright 2020-2022 Aion Technology LLC
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

import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {resourceLocations} from 'src/app/implementation/constants/locations';
import {resourceGrades} from 'src/app/implementation/constants/resourceGrades';
import {Game} from 'src/app/models/game/game';
import {Grade} from 'src/app/implementation/types/grade';
import {MetaDataService} from 'src/app/modules/shared/services/meta-data/meta-data.service';
import {DialogComponent} from '../../../../implementation/component/dialog-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {GAME_DATA_SOURCE} from '../../../../providers/global/global-game-providers-factory';

@Component({
  selector: 'ms-game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss']
})
export class GameDialogComponent extends DialogComponent<Game, GameDialogComponent> implements OnInit {
  grades: Grade[] = resourceGrades;
  locations: { [key: string]: string } = resourceLocations;
  activityFocusList$: Observable<string[]>;
  leadershipSkillList$: Observable<string[]>;
  leadershipTraitList$: Observable<string[]>;

  constructor(
    // For super
    @Inject(MAT_DIALOG_DATA) public data: { model: Game, panelTitle: string },
    formBuilder: UntypedFormBuilder,
    dialogRef: MatDialogRef<GameDialogComponent>,
    @Inject(GAME_DATA_SOURCE) gameDataSource: DataSource<Game>,
    // Other
    private metaDataService: MetaDataService,
  ) {
    super(data?.model, formBuilder, dialogRef, gameDataSource)
  }

  gradeRangeValidator = (control: AbstractControl): { [key: string]: boolean } => {
    const grade1 = control.get('grade1');
    const grade2 = control.get('grade2');
    if (!grade1 || !grade2) {
      return null;
    }
    return (grade1.value > grade2.value) ? {invalidRange: true} : null;
  }

  ngOnInit(): void {
    this.init()

    this.metaDataService.loadActivityFocuses();
    this.activityFocusList$ = this.metaDataService.activityFocuses;

    this.metaDataService.loadLeadershipSkills();
    this.leadershipSkillList$ = this.metaDataService.leadershipSkills;

    this.metaDataService.loadLeadershipTraits();
    this.leadershipTraitList$ = this.metaDataService.leadershipTraits;
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
  }

  protected toModel(formValue: any): Game {
    const game: Game = new Game(formValue);
    if (this.isUpdate) {
      game.links = formValue.game.links
    }
    return game;
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, game: Game): FormGroup {
    return formBuilder.group({
      game,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(255)],
      gradeRange: formBuilder.group({
        grade1: ['', Validators.required],
        grade2: ['', Validators.required]
      }, {validator: this.gradeRangeValidator}),
      location: ['OFFLINE', Validators.required],
      activityFocuses: [],
      leadershipSkills: [],
      leadershipTraits: []
    })
  }

  protected doUpdateFormGroup(formGroup: FormGroup, game: Game): void {
    formGroup.setValue({
      game,
      name: game?.name,
      description: game?.description,
      gradeRange: {
        grade1: game?.grade1?.toString(),
        grade2: game?.grade2?.toString()
      },
      location: game?.location?.toString(),
      activityFocuses: game?.activityFocuses,
      leadershipSkills: game?.leadershipSkills,
      leadershipTraits: game?.leadershipTraits
    })
  }
}
