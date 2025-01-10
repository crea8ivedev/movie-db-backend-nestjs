import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  
  const configService = app.get(ConfigService);

  const sessionConfig = configService.get('session');
  const validUsername = configService.get('API_DOCS_AUTH_USERNAME', "admin");
  const validPassword = configService.get('API_DOCS_AUTH_PASSWORD', "admin");
  const frontendUrl = configService.get('FRONTEND_URL');

  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  app.use(
    '/api-docs',
    basicAuth({
      users: { [validUsername]: validPassword },
      challenge: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          [error.property]:
            error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: Object.assign({}, ...result),
        });
      },
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('API for managing movies')
    .setVersion('1.0')
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
bootstrap();
