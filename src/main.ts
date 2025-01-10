import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Assistente Virtual')
  .setDescription('Documentação da API')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 8080);
  console.log(`Porta Do Swagger: http://localhost:${process.env.PORT}/api`);

}
bootstrap();
