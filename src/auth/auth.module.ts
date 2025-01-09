import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    UserModule,
    ConfigModule,
  ],
  providers: [AuthService, LocalStrategy, AuthMiddleware],
  controllers: [AuthController],
  exports: [AuthService, AuthMiddleware],
})
export class AuthModule {}
