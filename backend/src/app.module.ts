import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

// modulo raiz - punto de entrada de la aplicación
@Module({
  imports: [UsersModule], // modulo de usuarios
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
