import { HttpInterceptorFn, } from '@angular/common/http';
import { inject, } from '@angular/core';
import { from, switchMap, } from 'rxjs';
import { environment, } from '../../../environments/environment';
import { AuthService, } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next,) => {
    /*
     * Never send our Keycloak
     * access token to unrelated
     * external URLs.
     */
    if (!request.url.startsWith(environment.apiUrl,)) {
        return next(request,);
    }
    const auth = inject(AuthService);
    return from(auth.getValidAccessToken()).pipe(switchMap(token => {
        if (!token) { return next(request); }
        const authenticatedRequest = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        return next(authenticatedRequest);
    }));
};
