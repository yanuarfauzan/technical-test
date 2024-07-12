import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as momentTimezone from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const timezone = 'Asia/Jakarta';
  momentTimezone.tz.setDefault(timezone);

  const options = new DocumentBuilder().setTitle('Demo API Technical Test')
  .setDescription('Backend Technical Test')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, options);

  const swaggerPath = './swagger.json';
  fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2));

  const swaggerUiOptions = {
    explorer: true,
  };
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document, swaggerUiOptions));

  await app.listen(3000);
}
bootstrap();
