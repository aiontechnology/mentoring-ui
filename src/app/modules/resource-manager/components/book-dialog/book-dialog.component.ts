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

@Component({
  selector: 'ms-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent {

  model: FormGroup;
  isUpdate = false;

  grades: Grade[] = grades;
  interestList: Element[];
  leadershipTraitList: Element[];
  leadershipSkillList: Element[];

  constructor(private dialogRef: MatDialogRef<BookDialogComponent>,
              private bookService: BookRepositoryService,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
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
  }

  save(): void {
    const newBook = new Book(this.model.value);
    console.log('Saving book', newBook);
    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newBook._links = this.model.value.book._links;
      this.bookService.updateBook(newBook).then(book => {
        this.dialogRef.close(book);
      });
    } else {
      this.bookService.createBook(newBook).then(book => {
        this.dialogRef.close(book);
      });
    }
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, book: Book): FormGroup {
    console.log('Book', book);
    const formGroup: FormGroup = formBuilder.group({
      book,
      title: ['', Validators.required],
      author: ['', Validators.required],
      gradeLevel: ['', Validators.required],
      interests: [],
      leadershipTraits: [],
      leadershipSkills: []
    });
    if (this.isUpdate) {
      formGroup.setValue({
        book,
        title: book?.title,
        author: book?.author,
        gradeLevel: book?.gradeLevel?.toString(),
        interests: this.convertArray(book?.interests),
        leadershipSkills: this.convertArray(book?.leadershipSkills),
        leadershipTraits: this.convertArray(book?.leadershipTraits)
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
