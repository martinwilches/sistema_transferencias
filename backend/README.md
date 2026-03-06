## Librerías

### typeorm

```bash
npm install @nestjs/typeorm typeorm pg
```

### @nestjs/config

```bash
npm install @nestjs/config
```

## Módulos

### Users

```bash
nest generate module users
nest generate controller users
nest generate service users
```

### Transactions

```bash
nest generate module transactions
nest generate controller transactions
nest generate service transactions
```

## Endpoints

Crear usuario

```http
POST /users

{
    name: string,
    email: string,
    initialBalance: number
}
```

Obtener usuario por email

```http
GET /users/:email
```

Crear transferencia

```http
POST /transactions

{
    fromEmail: string,
    toEmail: string,
    amount: number
}
```

Buscar transferencias por email

GET /transactions?email=

## Base de datos

Consultar los registros almacenados en base de datos desde la terminal.

```bash
docker exec -it postgres_db psql -U root -d sistema_transferencias
```