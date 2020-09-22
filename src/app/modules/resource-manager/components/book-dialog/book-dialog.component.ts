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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book/book';
import { BookRepositoryService } from '../../services/resources/book-repository.service';
import { Grade } from 'src/app/modules/shared/types/grade';
import { grades } from 'src/app/modules/shared/constants/grades';
import { MetaDataService } from '../../services/meta-data/meta-data.service';
import { Element } from '../../models/meta-data/element';
import { CallerWithErrorHandling } from 'src/app/implementation/util/caller-with-error-handling';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ms-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent {

  model: FormGroup;
  isUpdate = false;

  grades: Grade[] = grades;
  locations: string[] = ['Offline', 'Online', 'Both'];
  interestList: Element[];
  leadershipTraitList: Element[];
  leadershipSkillList: Element[];
  phonogramList: Element[];
  behaviorList: Element[];

  private caller = new CallerWithErrorHandling<Book, BookDialogComponent>();

  constructor(private dialogRef: MatDialogRef<BookDialogComponent>,
              private bookService: BookRepositoryService,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);

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

    metaDataService.loadPhonograms();
    metaDataService.phonograms.subscribe(phonograms => {
      this.phonogramList = phonograms;
    });

    metaDataService.loadBehaviors();
    metaDataService.behaviors.subscribe(behaviors => {
      this.behaviorList = behaviors;
    });
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
        interests: this.convertArray(book?.interests),
        leadershipSkills: this.convertArray(book?.leadershipSkills),
        leadershipTraits: this.convertArray(book?.leadershipTraits),
        phonograms: this.convertArray(book?.phonograms),
        behaviors: this.convertArray(book?.behaviors)
      });
    }
    return formGroup;
  }

  private convertArray(array: [any]) {
    const result = [];
    if (array) {
      for (const item of array) {
        result.push(item.name as string);
      }
    }
    console.log('result', result);
    return result;
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
