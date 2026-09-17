import Keycloak from 'keycloak-js';

import {
    environment,
} from '../../../environments/environment';

export const keycloak =
    new Keycloak({
        url:
            environment.keycloak.url,

        realm:
            environment.keycloak.realm,

        clientId:
            environment.keycloak.clientId,
    });