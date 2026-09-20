import {
  Component,
  inject,
} from '@angular/core';

import {
  AsyncPipe,
} from '@angular/common';

import {
  tap,
} from 'rxjs';

import {
  StudentApiService,
} from '../student/services/student-api.service';

@Component({
  standalone: true,

  selector: 'app-student-home',

  imports: [
    AsyncPipe,
  ],

  template: `
    <h1>Students</h1>

    <p>
      Student MFE loaded
    </p>

    @if (students$ | async; as students) {

      <p>
        Total students:
        {{ students.length }}
      </p>

      @for (
        student of students;
        track student.id
      ) {
        <div>
          {{ student.firstName }}
          {{ student.lastName }}
        </div>
      }

    }
  `,
})
export class StudentHomeComponent {

  private readonly api =
    inject(StudentApiService);

  /*
   * Replace these with your
   * REAL UUID values.
   */
  private readonly organizationId =
    '661633d1-dcdd-43d3-86e2-a8054931633f';

  private readonly branchId =
    'b7e32229-0231-4395-806d-aed192cb504b';

  readonly students$ =
    this.api
      .getStudents(
        this.organizationId,
        this.branchId,
      )
      .pipe(
        tap(data => {
          console.log(
            'Student API response:',
            data,
          );
        }),
      );

  constructor() {
    console.log(
      'StudentHomeComponent loaded',
    );

    console.log(
      'organizationId:',
      this.organizationId,
    );

    console.log(
      'branchId:',
      this.branchId,
    );
  }
}