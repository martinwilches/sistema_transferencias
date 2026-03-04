// estructura de los datos que se esperan al crear un usuario
export class CreateUserDto {
    name: string;
    email: string;
    initialBalance: number;
}