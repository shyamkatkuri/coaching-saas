import {
  Component,
  inject,
} from '@angular/core';

import {
  RouterOutlet,
} from '@angular/router';

import {
  AuthService,
} from './core/auth/auth.service';
@Component({
  selector:
    'app-root',

  standalone:
    true,

  imports: [
    RouterOutlet,
  ],

  templateUrl:
    './app.html',
})
export class App {
  readonly auth =
    inject(AuthService);

  logout(): void {
    void this.auth.logout();
  }
}
