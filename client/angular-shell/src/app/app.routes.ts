import { Routes, } from '@angular/router';
import { loadRemoteModule, } from '@angular-architects/native-federation';
import { authGuard, } from './core/auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'tenants', pathMatch: 'full', },

    {
        path: 'tenants',
        canActivate: [authGuard,],
        loadChildren: () => loadRemoteModule('tenant-mfe', './Routes',).then(m => m.TENANT_ROUTES),
    },
];