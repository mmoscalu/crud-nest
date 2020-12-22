import {Body, Controller, Delete, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";
import {Response} from "../_core/_model/response.model";
import {GetUser} from "./get-user.decorator";
import {User} from "./user.entity";
import {AuthGuard} from "@nestjs/passport";

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

    @Post('/signin')
    async singIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.singIn(authCredentialsDto);
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Response>  {
        return this.authService.delete(id);
    }

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@GetUser() user: User) {
    //     console.log('controller --- ', user)
    // }
}