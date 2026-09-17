import {
  Component,
  inject,
} from '@angular/core';

import {
  AsyncPipe,
} from '@angular/common';

import {
  TenantApiService,
} from '../../services/tenant-api.service';

@Component({
  standalone:
    true,

  selector:
    'app-tenant-home',

  imports: [
    AsyncPipe,
  ],

  templateUrl:
    './tenant-home.html',
})
export class TenantHome {
  private readonly api =
    inject(TenantApiService);

  readonly tenants$ =
    this.api.findAll();
}