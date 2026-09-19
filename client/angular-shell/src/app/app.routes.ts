import { Routes, } from '@angular/router';
import { authGuard, } from './core/auth/auth.guard';
import { loadRemoteRoutes } from './core/federation/remote-loader';

export const routes: Routes = [
    { path: '', redirectTo: 'tenants', pathMatch: 'full', },

    {
        path: 'tenants',
        canActivate: [authGuard,],
        loadChildren: () => loadRemoteRoutes('tenant-mfe', './Routes', 'TENANT_ROUTES'),
    },
    {
        path: 'students',
        canActivate: [authGuard,],
        loadChildren: () => loadRemoteRoutes('mfe-student', './Routes', 'STUDENT_ROUTES'),
    },
    {
        path: 'reports',
        canActivate: [authGuard,],
        loadChildren: () => loadRemoteRoutes('mfe-reports', './Routes', 'REPORTS_ROUTES'),
    },
    {
        path: 'labs/next',
        canActivate: [authGuard,],
        loadComponent: () => import('./features/labs/next-lab.component').then(m => m.NextLabComponent,),
    },
];