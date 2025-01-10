import { Module } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { GoogleApiController } from './google-api.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthController } from './auth/google-api.auth.controller';
import { GoogleAuth } from './auth/google-api.auth';

@Module({
  imports: [ConfigModule.forRoot()], 
  providers: [GoogleApiService,GoogleAuth],
  controllers: [GoogleApiController,GoogleAuthController]
})
export class GoogleApiModule {}
