import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Transaction)
        private transactionsRepository: Repository<Transaction>
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

    async findAccountState(email: string) {
        const user = await this.usersRepository.findOne({
            where: { email }
        })

        if (!user) throw new NotFoundException('Usuario no encontrado')

        const transactions = await this.transactionsRepository.find({
            where: [
                { fromEmail: email },
                { toEmail: email }
            ],
            order: {
                createdAt: 'DESC' // transacciones ordenadas de forma descendente
            }
        })

        if(!transactions.length) throw new NotFoundException('No se han encontrado transacciones')

        return {
            balance: user.initialBalance,
            transactions
        }
    }
}
