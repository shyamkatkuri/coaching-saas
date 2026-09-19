import {
    Component,
} from '@angular/core';

@Component({
    standalone:
        true,

    template: `
    <section>
      <h2>
        Feature temporarily unavailable
      </h2>

      <p>
        This part of the application
        could not be loaded.
      </p>
    </section>
  `,
})
export class RemoteUnavailableComponent { }