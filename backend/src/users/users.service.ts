import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    // metodo que recibe un DTO y se encarga de crear un nuevo usuario
    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = this.usersRepository.create(createUserDto)
            return await this.usersRepository.save(user)
        } catch (error) {
            // validación de email duplicado
            if (error.code === '23505') {
                throw new ConflictException('El email ya se encuentra registrado')
            }

            throw error
        }
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { email  } // equivalente a `SELECT * FROM usuarios WHERE email = ?`
        })

        if (!user) throw new NotFoundException('El usuario no se encuentra registrado')

        return user
    }
}
