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

## Base de datos

Consultar los registros almacenados en base de datos desde la terminal.

```bash
docker exec -it postgres_db psql -U root -d sistema_transferencias
```