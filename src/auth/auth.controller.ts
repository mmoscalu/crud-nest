import {Body, Controller, Delete, Param, ParseIntPipe, Post, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";
import {Response} from "../_core/_model/response.model";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {
    }

    @Post('/signup')
    async singUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<Response> {
        return this.authService.singUp(authCredentialsDto);
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Response>  {
        return this.authService.delete(id);
    }
}