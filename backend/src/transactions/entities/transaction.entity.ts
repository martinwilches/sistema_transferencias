import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transacciones')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fromEmail: string;

    @Column()
    toEmail: string;

    @Column('decimal', { default: 0 })
    amount: number;
}
