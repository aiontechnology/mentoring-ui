import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'ms-student-registration-thanks',
  templateUrl: './student-registration-thanks.component.html',
  styleUrls: ['./student-registration-thanks.component.scss']
})
export class StudentRegistrationThanksComponent implements OnInit {

  name: Observable<string>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.name = this.route.queryParamMap
      .pipe(
        map(params => params.get('name'))
      );
  }

}
