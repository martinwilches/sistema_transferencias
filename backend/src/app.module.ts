import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';

// modulo raiz - punto de entrada de la aplicación
@Module({
  imports: [
    // leer el archivo .env y permitir que las variables de entorno sean disponibles globalmente
    ConfigModule.forRoot({
      isGlobal: true
    }),
    // abrir una conexión TCP con postgres y establecer la conexión a base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule, // modulo de usuarios
    TransactionsModule // modulo de transacciones
  ]
})
export class AppModule {}
