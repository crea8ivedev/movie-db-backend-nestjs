import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import sessionConfig from './session.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [sessionConfig],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        SESSION_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class AppConfigModule {}
