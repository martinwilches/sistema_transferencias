import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        const user = this.usersRepository.create(createUserDto)

        return await this.usersRepository.save(user)
    }
}
