import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column('decimal', { default: 0 })
    initialBalance: number;
}
