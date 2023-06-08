import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto){
        return this.authService.login(loginUserDto);
    }

    @Get('private')
    @UseGuards( AuthGuard() )
    privateTest(
        @GetUser() user: User
    ){        
        return user;
    }
    
}
