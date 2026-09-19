import {
    Routes,
} from '@angular/router';

export const REPORTS_ROUTES:
    Routes = [
        {
            path: '',

            loadComponent: () =>
                import(
                    './reports-home.component'
                ).then(
                    m =>
                        m.ReportsHomeComponent,
                ),
        },
    ];