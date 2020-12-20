import {DeleteResult, EntityRepository, Repository} from "typeorm";
import {User} from "./user.entity";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {ConflictException, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import {Response} from "../_core/_model/response.model";
import {ValidationCodeErrors} from "../_core/_constants/validation-code-errors.const";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<Response> {
        const {username, password} = authCredentialsDto;

        const user: User = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await UserRepository.generateHashPassword(password, user.salt);

        try {
            await user.save();
            return new Response(`User "${user.username}" is successfully created`);
        } catch (error) {
            if (error.code === ValidationCodeErrors.USERNAME_ALREADY_EXIST) {
                throw new ConflictException('Username already exist');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    private static async generateHashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    async deleteUser(id: number): Promise<Response> {
        const result: DeleteResult = await this.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        } else {
            return new Response(`User with ID "${id}" is successfully deleted`);
        }
    }
}