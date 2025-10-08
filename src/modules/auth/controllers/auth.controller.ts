import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    @Get()
    getAuth(){
        return "Auth is working"
    }

    @Post('signup')
    signup(@Body() createUserData: any){
        
    }
}
