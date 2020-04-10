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
import { FormControl, Validators } from '@angular/forms';
import { School } from '../../models/school';
import { MatDialogRef } from '@angular/material/dialog';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'ms-new-school-dialog',
  templateUrl: './new-school-dialog.component.html',
  styleUrls: ['./new-school-dialog.component.scss']
})
export class NewSchoolDialogComponent implements OnInit {

  school: School;

  name = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<NewSchoolDialogComponent>, private schoolService: SchoolService) { }

  ngOnInit(): void {
    this.school = new School();
  }

  getErrorMessage() {
    return this.name.hasError('required') ? 'You must enter a name' : '';
  }

  save() {
    this.schoolService.addSchool(this.school).then(school => {
      this.dialogRef.close(school);
    });
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
