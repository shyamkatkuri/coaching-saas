import {
    Global,
    Module,
} from '@nestjs/common';

import {
    DatabaseRegistryService,
} from './database-registry.service';

import {
    DatabaseService,
} from './database.service';

@Global()
@Module({
    providers: [
        DatabaseRegistryService,
        DatabaseService,
    ],

    exports: [
        DatabaseRegistryService,
        DatabaseService,
    ],
})
export class DatabaseModule { }