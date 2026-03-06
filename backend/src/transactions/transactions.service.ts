import { DataSource, Like, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTransactionDto } from './dto/create-transaction.dto';

import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private transactionsRepository: Repository<Transaction>,

        @InjectRepository(User)
        private usersRepository: Repository<User>,

        // DataSource es el objeto de TypeORM para crear QueryRunners para ejecutar la transaccion en base de datos
        private readonly dataSource: DataSource
    ) {}

    async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const { fromEmail, toEmail, amount } = createTransactionDto

        if (fromEmail === toEmail) {
            throw new BadRequestException('El email origen no puede ser igual al email destinatario')
        }

        // buscar si existe el usuario origen en base de datos
        const fromUser = await this.usersRepository.findOne({
            where: { email: fromEmail }
        })

        if (!fromUser) {
            throw new NotFoundException('El email origen no se encuentra registrado')
        }

        // buscar si existe el usuario destino en base de datos
        const toUser = await this.usersRepository.findOne({
            where: { email: toEmail }
        })

        if (!toUser) {
            throw new NotFoundException('El email destino no se encuentra registrado')
        }

        // convertir monto a formato número
        const amountNumber = Number(amount)

        // validar que el usuario que realiza la transaccion tenga saldo suficiente
        if (Number(fromUser.initialBalance) < amountNumber) {
            throw new BadRequestException(`Saldo insuficiente. Balance disponible ${fromUser.initialBalance}`)
        }

        const queryRunner = this.dataSource.createQueryRunner()

        // establecer la conexión y abrir la transacción
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // descontar el monto del balance del emisor
            fromUser.initialBalance = Number(fromUser.initialBalance) - amountNumber
            await queryRunner.manager.save(fromUser)

            // sumar el monto al balance del receptor
            toUser.initialBalance = Number(toUser.initialBalance) + amountNumber
            await queryRunner.manager.save(toUser)

            // crear el registro de la transacción
            const transaction = this.transactionsRepository.create({
                fromEmail,
                toEmail,
                amount
            })
            const savedTransaction = queryRunner.manager.save(transaction)

            // confirmación de la transacción en la base de datos
            await queryRunner.commitTransaction()

            return savedTransaction
        } catch(error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async findByEmail(email: string): Promise<Transaction[]> {
        const transactions = await this.transactionsRepository.find({
            where: [
                { fromEmail: Like(`${email}%`) },
                { toEmail: Like(`${email}%`) }
            ],
            order: {
                createdAt: 'DESC' // transacciones ordenadas de forma descendente
            }
        })

        if(!transactions.length) throw new NotFoundException('No se han encontrado transacciones')

        return transactions
    }
}
