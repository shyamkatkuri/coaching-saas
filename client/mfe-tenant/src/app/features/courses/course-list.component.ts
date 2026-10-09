import {
    Component,
    inject,
} from '@angular/core';

import {
    AsyncPipe,
} from '@angular/common';

import {
    CourseApiService,
} from './course-api.service';

import {
    TenantScopeService,
} from '../shared/tenant-scope.service';

@Component({
    standalone: true,

    selector:
        'app-course-list',

    imports: [
        AsyncPipe,
    ],

    template: `
    <h1>Courses</h1>

    @if (
      courses$ | async;
      as courses
    ) {

      <p>
        Total:
        {{ courses.length }}
      </p>

      @for (
        course of courses;
        track course.id
      ) {

        <section>
          <strong>
            {{ course.name }}
          </strong>

          <span>
            {{ course.course_code }}
          </span>

          <span>
            {{ course.status }}
          </span>
        </section>

      }

    }
  `,
})
export class CourseListComponent {

    private readonly api =
        inject(
            CourseApiService,
        );

    private readonly scope =
        inject(
            TenantScopeService,
        );

    private readonly org =
        this.scope.organizationId();

    readonly courses$ =
        this.api.getCourses(
            this.org!,
        );
}