import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { DatabaseModule } from './app/database/database.module';
import { HealthModule } from './app/health/health.module';
import { TenantModule } from './app/tenant/tenant.module';
import { BranchModule } from './app/branch/branch.module';
import { TenantSettingsModule } from './app/tenant-settings/tenant-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    TenantModule,
    BranchModule,
    TenantSettingsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
