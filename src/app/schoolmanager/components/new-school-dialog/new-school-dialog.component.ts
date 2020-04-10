/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { School } from '../../models/school';
import { MatDialogRef } from '@angular/material/dialog';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'ms-new-school-dialog',
  templateUrl: './new-school-dialog.component.html',
  styleUrls: ['./new-school-dialog.component.scss']
})
export class NewSchoolDialogComponent implements OnInit {

  model: FormGroup;

  constructor(private dialogRef: MatDialogRef<NewSchoolDialogComponent>,
              private schoolService: SchoolService,
              private formBuilder: FormBuilder) {
    this.model = formBuilder.group({
      name: ['', Validators.required],
      address: formBuilder.group({
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      }),
      phone: ''
    });
  }

  ngOnInit(): void {
  }

  save() {
    this.schoolService.addSchool(this.model.value as School).then(school => {
      this.dialogRef.close(school);
    });
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
