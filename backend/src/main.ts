import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestFactory crea la instancia de la aplicación Nest, usando AppModule como modulo raíz
  const app = await NestFactory.create(AppModule);

  // permitir peticiones desde el front
  app.enableCors({
    origin: 'http://localhost:5173'
  })

  // levantar el servidor en el puerto 3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
