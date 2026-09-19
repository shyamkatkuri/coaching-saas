import {
    Routes,
} from '@angular/router';

import {
    loadRemoteModule,
} from '@angular-architects/native-federation';

export async function loadRemoteRoutes(
    remoteName: string,
    exposedModule: string,
    routesExport:
        string,
): Promise<Routes> {
    try {
        const remote =
            await loadRemoteModule(
                remoteName,
                exposedModule,
            );

        const routes =
            remote[
            routesExport
            ];

        if (
            !Array.isArray(
                routes,
            )
        ) {
            throw new Error(
                `Remote ${remoteName} did not expose valid routes`,
            );
        }

        return routes;
    } catch (error) {
        console.error(
            `Failed to load ${remoteName}`,
            error,
        );

        return [
            {
                path: '',

                loadComponent:
                    () =>
                        import(
                            './remote-unavailable.component'
                        ).then(
                            m =>
                                m.RemoteUnavailableComponent,
                        ),
            },
        ];
    }
}