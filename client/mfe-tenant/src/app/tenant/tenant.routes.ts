import { Routes } from '@angular/router';

export const TENANT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/tenant-home/tenant-home')
                .then(m => m.TenantHome),
    },
];