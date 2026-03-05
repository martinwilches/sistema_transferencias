// estructura de los datos que se esperan al crear un usuario
export class CreateTransactionDto {
    fromEmail: string;
    toEmail: string;
    amount: number;
}