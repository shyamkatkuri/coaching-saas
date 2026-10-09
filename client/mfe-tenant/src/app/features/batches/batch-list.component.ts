import {
    Component,
    inject,
} from '@angular/core';

import {
    AsyncPipe,
} from '@angular/common';

import {
    BatchApiService,
} from './batch-api.service';

import {
    TenantScopeService,
} from '../shared/tenant-scope.service';

@Component({
    standalone: true,

    imports: [
        AsyncPipe,
    ],

    template: `
    <h1>Batches</h1>

    @if (
      batches$ | async;
      as batches
    ) {

      <p>
        Total:
        {{ batches.length }}
      </p>

      @for (
        batch of batches;
        track batch.id
      ) {

        <section>

          <strong>
            {{ batch.name }}
          </strong>

          <div>
            Code:
            {{ batch.code }}
          </div>

          <div>
            Capacity:
            {{ batch.capacity }}
          </div>

          <div>
            Status:
            {{ batch.status }}
          </div>

          <div>
            Trainers:
            {{ batch.trainerIds.length }}
          </div>

        </section>

      }

    }
  `,
})
export class BatchListComponent {

    private readonly api =
        inject(
            BatchApiService,
        );

    private readonly scope =
        inject(
            TenantScopeService,
        );

    readonly batches$ =
        this.api.getBatches(
            this.scope.organizationId()!,
            this.scope.branchId()!,
        );
}