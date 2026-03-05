import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// prefijo de ruta del controlador, todas las rutas de este contralador deberán iniciar con `/users`
@Controller('users')

// recibir las peticiones HTTP y delegar la logica de negocio al service `UsersService`
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post() // `/users`
    // @Body extrae el cuerpo de la peticion y lo mapea en el DTO
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get(':email') // `/users/:email`
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email)
    }
}
