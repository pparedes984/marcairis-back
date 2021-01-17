import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
//TODO Email

@Entity()
@Unique(['idUsuario'])
export class Usuario {

    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column()
    @IsNotEmpty()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()// @IsEmail()
    email: string;

    @Column()
    contrasena: string;

    @Column()
    pin: string;

    @Column()
    celular: string;

    @Column()
    fechanacimiento: string;

    @Column()
    sexo: string;

    @Column()
    descripcion: string;

    @Column()
    paisresidencia: string;

    @Column()
    ciudadresidencia: string;

    @Column()
    imagen: string;


    hashearPassw():void{
        const salt = bcrypt.genSaltSync(10);
        this.contrasena = bcrypt.hashSync(this.contrasena, salt);
        this.pin = bcrypt.hashSync(this.pin, salt);
    }


    checkPassw(password): boolean {
        return bcrypt.compareSync(password, this.contrasena);
    }

    checkPin(password): boolean {
        return bcrypt.compareSync(password, this.pin);
    }


}

//Nombres, Apellidos, Email, email_verified_at, Contraseña, Celular, remember_token, created_at, updated_at)