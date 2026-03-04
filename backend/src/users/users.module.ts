import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController], // controladores del modulo
  providers: [UsersService]
})
export class UsersModule {}
