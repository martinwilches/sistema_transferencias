import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RevertTransactionDto } from './dto/revert-transaction.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post() // `/transactions`
    create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionsService.create(createTransactionDto)
    }

    @Get()
    findByEmail(@Query('email') email: string) {
        return this.transactionsService.findByEmail(email)
    }

    @Put('revert')
    revert(@Body() revertTransactionDto: RevertTransactionDto) {
        return this.transactionsService.revert(revertTransactionDto)
    }
}
