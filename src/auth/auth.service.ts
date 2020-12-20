import {Injectable, NotFoundException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {Response} from "../_core/_model/response.model";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<Response> {
        return this.userRepository.singUp(authCredentialsDto);
    }

    async delete(id: number): Promise<Response> {
       return await this.userRepository.deleteUser(id);
    }
}