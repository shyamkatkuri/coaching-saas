import {
    Component,
    inject,
} from '@angular/core';

import {
    AsyncPipe,
} from '@angular/common';

import {
    TrainerApiService,
} from './trainer-api.service';

import {
    TenantScopeService,
} from '../shared/tenant-scope.service';

@Component({
    standalone: true,

    imports: [
        AsyncPipe,
    ],

    template: `
    <h1>Trainers</h1>

    @if (
      trainers$ | async;
      as trainers
    ) {

      <p>
        Total:
        {{ trainers.length }}
      </p>

      @for (
        trainer of trainers;
        track trainer.id
      ) {

        <section>

          {{ trainer.firstName }}

          {{ trainer.lastName }}

          -

          {{ trainer.status }}

        </section>

      }

    }
  `,
})
export class TrainerListComponent {

    private readonly api =
        inject(
            TrainerApiService,
        );

    private readonly scope =
        inject(
            TenantScopeService,
        );

    readonly trainers$ =
        this.api.getTrainers(
            this.scope.organizationId()!,
            this.scope.branchId()!,
        );
}