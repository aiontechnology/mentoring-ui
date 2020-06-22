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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Book } from '../../models/book/book';
import { BookService } from '../../services/resources/book.service';
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
              private bookService: BookService,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.book);

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
    const newBook = this.model.value as Book;
    if (this.isUpdate) {

    } else {
      this.bookService.addBook(newBook).then(book => {
        this.dialogRef.close(book);
      });
    }
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, book: Book): FormGroup {
    return formBuilder.group({
      book,
      title: book?.title || '',
      author: book?.author || '',
      gradeLevel: book?.gradeLevel || '',
      interests: [],
      leadershipTraits: [],
      leadershipSkills: []
    });
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
