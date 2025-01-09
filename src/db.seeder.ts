import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  console.log('Seeding users...');
  await seederService.seedUsers();

  console.log('Seeding complete.');
  await app.close();
}

bootstrap();
