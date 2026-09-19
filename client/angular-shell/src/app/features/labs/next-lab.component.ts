import {
    Component,
    HostListener,
    signal,
} from '@angular/core';

@Component({
    selector:
        'app-next-lab',

    standalone:
        true,

    template: `
    <section>

      <h1>
        Angular hosting Next.js
      </h1>

      <iframe
        src=
          "http://localhost:4202/labs/next-widget"
        title=
          "Next.js Course Widget"
        width=
          "600"
        height=
          "300"
        sandbox=
          "allow-scripts allow-same-origin">
      </iframe>

      @if (selectedCourse()) {

        <p>
          Angular received:
          {{ selectedCourse() }}
        </p>

      }

    </section>
  `,
})
export class NextLabComponent {

    readonly selectedCourse =
        signal<string | null>(
            null,
        );

    @HostListener(
        'window:message',
        ['$event'],
    )
    onMessage(
        event: MessageEvent,
    ): void {

        /*
         * Never trust arbitrary
         * postMessage senders.
         */
        if (
            event.origin !==
            'http://localhost:4202'
        ) {

            return;

        }

        if (
            event.data?.type !==
            'NEXT_COURSE_SELECTED'
        ) {

            return;

        }

        const courseId =
            event.data?.payload
                ?.courseId;

        if (
            typeof courseId !==
            'string'
        ) {

            return;

        }

        this.selectedCourse.set(
            courseId,
        );
    }
}