import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4000;
  const subscriptionId = '6717968';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
      transform: true,
    }),
  );

  // swagger setup
  const options = new DocumentBuilder()
    .setExternalDoc('/openapi.json', `http://localhost:${port}/api-docs-json`)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(port);

  Logger.debug(`http://localhost:${port}/api-docs`);
}
bootstrap();
