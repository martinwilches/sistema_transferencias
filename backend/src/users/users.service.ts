import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users: any[] = [] // simulacion de una base de datos con un array en memoria

    // metodo que recibe un DTO y se encarga de crear un nuevo usuario
    create(createUserDto: CreateUserDto) {
        const newUser = {
            id: Date.now(), // id simulado con el timestamp actual
            ...createUserDto // name, email e initialBalance del DTO
        };

        // guardar el usuario en el array (-- base de datos simulada --)
        this.users.push(newUser);

        // retornar el objeto con la informacion del nuevo usuario creado
        return newUser;
    }
}
