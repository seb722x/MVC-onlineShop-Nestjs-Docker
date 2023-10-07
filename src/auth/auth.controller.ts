import {
  Controller,
  Get,
  Render,
  Post,
  Redirect,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from 'src/models/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Get('/register')
  @Render('auth/register')
  register() {
    const viewData = [];
    viewData['title'] = 'User Register - Online Store';
    viewData['subtitle'] = 'User Register';
    return {
      viewData: viewData,
    };
  }

  @Post('/store')
  async store(@Body() body:CreateUserDto, @Res() response, @Req() request) {
    await this.authService.create(body);
    console.log(body);
    
    return response.redirect('/auth/login');
    }
  

  @Get('/login')
  @Render('auth/login')
  login() {
    const viewData = [];
    viewData['title'] = 'User Login - Online Store';
    viewData['subtitle'] = 'User Login';
    return {
      viewData: viewData,
    };
  }

  @Post('/connect')
  @HttpCode(HttpStatus.OK)
  async connect(@Body() loginUserDto:LoginUserDto, @Res({ passthrough: true }) response) {
    const { token } = await this.authService.login(loginUserDto);

    response.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 

    return response.redirect('/products'); 
}

  @Get('/logout')
  @Redirect('/')
  logout(@Req() request) {
    request.session.user = null;
  }

  
  @Get('/private3')
  @Auth( ValidRoles.admin )
  privateRoute3(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }
  }
}
