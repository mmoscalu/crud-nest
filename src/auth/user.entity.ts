import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import * as bcrypt from 'bcrypt';
import {Task} from "../tasks/task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, { eager: true})
    tasks: Task[]

    async isValidPassword(password: string): Promise<boolean> {
        const hash: string = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}