import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

    @Column({ default: false })
    isReverted: boolean; // campo que indica si la transaccion fue revertida

    @CreateDateColumn({
        transformer: {
            to: (value: Date) => value, // guardar normal la fecha
            from: (value: Date) => value.toLocaleString('sv-SE').split('.')[0].replace('T', ' ') // recuperar la fecha formateada
        }
    })
    createdAt: string;
}
