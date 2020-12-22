import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {Response} from "../_core/_model/response.model";
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "./jwt-payload.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {
    }

    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<Response> {
        return this.userRepository.singUp(authCredentialsDto);
    }

    async singIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const username: string = await this.userRepository.validatePassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException(`Invalid user credentials`);
        }

        const payload: JwtPayload = { username };
        const accessToken: string = this.jwtService.sign(payload);
        return { accessToken }

    }

    async delete(id: number): Promise<Response> {
        return await this.userRepository.deleteUser(id);
    }
}