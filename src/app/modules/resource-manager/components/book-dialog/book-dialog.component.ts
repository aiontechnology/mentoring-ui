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

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book/book';
import { BookRepositoryService } from '../../services/resources/book-repository.service';
import { Grade } from 'src/app/modules/shared/types/grade';
import { resourceGrades } from 'src/app/modules/shared/constants/resourceGrades';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { CallerWithErrorHandling } from 'src/app/implementation/util/caller-with-error-handling';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'ms-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent implements OnInit {

  model: FormGroup;
  isUpdate = false;

  grades: Grade[] = resourceGrades;
  locations: string[] = ['Offline', 'Online', 'Both'];
  interestList$: Observable<string[]>;
  leadershipTraitList$: Observable<string[]>;
  leadershipSkillList$: Observable<string[]>;
  phonogramList$: Observable<string[]>;
  behaviorList$: Observable<string[]>;

  private caller = new CallerWithErrorHandling<Book, BookDialogComponent>();

  constructor(private dialogRef: MatDialogRef<BookDialogComponent>,
              private bookService: BookRepositoryService,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(this.formBuilder, this.data?.model);
  }

  ngOnInit(): void {

    this.metaDataService.loadInterests();
    this.interestList$ = this.metaDataService.interests;

    this.metaDataService.loadLeadershipTraits();
    this.leadershipTraitList$ = this.metaDataService.leadershipTraits;

    this.metaDataService.loadLeadershipSkills();
    this.leadershipSkillList$ = this.metaDataService.leadershipSkills;

    this.metaDataService.loadPhonograms();
    this.phonogramList$ = this.metaDataService.phonograms;

    this.metaDataService.loadBehaviors();
    this.behaviorList$ = this.metaDataService.behaviors;

  }

  save(): void {
    const newBook = new Book(this.model.value);
    let func: (item: Book) => Promise<Book>;
    console.log('Saving book', newBook);
    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newBook._links = this.model.value.book._links;
      func = this.bookService.updateBook;
    } else {
      func = this.bookService.createBook;
    }
    this.caller.callWithErrorHandling(this.bookService, func, newBook, this.dialogRef, this.snackBar);
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, book: Book): FormGroup {
    console.log('Book', book);
    const formGroup: FormGroup = formBuilder.group({
      book,
      title: ['', [Validators.required, Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.maxLength(30)]],
      gradeLevel: ['', Validators.required],
      location: ['OFFLINE', Validators.required],
      interests: [],
      leadershipTraits: [],
      leadershipSkills: [],
      phonograms: [],
      behaviors: []
    });
    if (this.isUpdate) {
      formGroup.setValue({
        book,
        title: book?.title,
        author: book?.author,
        gradeLevel: book?.gradeLevel?.toString(),
        location: book?.location?.toString(),
        interests: book?.interests,
        leadershipSkills: book?.leadershipSkills,
        leadershipTraits: book?.leadershipTraits,
        phonograms: book?.phonograms,
        behaviors: book?.behaviors
      });
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
