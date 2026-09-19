import {
    Component,
} from '@angular/core';

@Component({
    selector:
        'app-student-home',

    standalone:
        true,

    template: `
    <section>
      <h1>
        Student Management
      </h1>

      <p>
        Student MFE loaded successfully.
      </p>
    </section>
  `,
})
export class StudentHomeComponent { }