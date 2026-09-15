import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tenants',
        pathMatch: 'full',
    },
    {
        path: 'tenants',
        loadChildren: () =>
            loadRemoteModule('tenant-mfe', './Routes')
                .then(m => m.TENANT_ROUTES),
    },
];