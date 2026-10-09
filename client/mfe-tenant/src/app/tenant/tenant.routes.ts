import { Routes } from '@angular/router';

export const TENANT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/tenant-home/tenant-home')
                .then(m => m.TenantHome),
    },
    {
        path:
            'courses',

        loadComponent: () =>
            import(
                '../features/courses/course-list.component'
            ).then(
                m =>
                    m.CourseListComponent,
            ),
    },

    {
        path:
            'trainers',

        loadComponent: () =>
            import(
                '../features/trainers/trainer-list.component'
            ).then(
                m =>
                    m.TrainerListComponent,
            ),
    },

    {
        path:
            'batches',

        loadComponent: () =>
            import(
                '../features/batches/batch-list.component'
            ).then(
                m =>
                    m.BatchListComponent,
            ),
    },
];