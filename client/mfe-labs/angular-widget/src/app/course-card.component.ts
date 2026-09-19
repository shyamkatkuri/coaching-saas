import {
    Component,
    input,
    output,
} from '@angular/core';

@Component({
    selector: 'app-course-card',

    standalone: true,

    template: `
    <article class="card">

      <h2>
        {{ instituteName() }}
      </h2>

      <h3>
        Full Stack Development
      </h3>

      <p>
        Angular + Node.js + Python
      </p>

      <button
        type="button"
        (click)="selectCourse()">

        View Course

      </button>

    </article>
  `,

    styles: [`
    .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
    }

    button {
      padding: 8px 16px;
      cursor: pointer;
    }
  `],
})
export class CourseCardComponent {

    readonly instituteName =
        input('Coaching Institute');

    readonly courseSelected =
        output<string>();

    selectCourse(): void {

        this.courseSelected.emit(
            'full-stack-development',
        );

    }
}