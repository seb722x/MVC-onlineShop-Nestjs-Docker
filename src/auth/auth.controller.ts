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
    //const toValidate: string[] = ['name', 'email', 'password'];
    //const errors: string[] = UserValidator.validate(body, toValidate);
   //if (errors.length > 0) {
   //  request.session.flashErrors = errors;
   //  return response.redirect('/auth/register');
   //} else {
    console.log(body);

    await this.authService.create(body);
      //const newUser = new User();
      //newUser.setName(body.name);
      //newUser.setPassword(body.password);
      //newUser.setEmail(body.email);
      //newUser.setRole('client');
      //newUser.setBalance(1000);
      //await this.authService.createOrUpdate(newUser);
      return response.redirect('/auth/login');
    }
  //}

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

  //@Post('/connect')
  //async connect(@Body() body, @Req() request, @Res() response) {
  //  
  //  const { token } = await this.authService.login(body,request,response);
  //  response.cookie('token', token, { httpOnly: true }); // Ejemplo con cookies (configúralo según tus necesidades)
  //  return response.redirect('/');
  //  
  //};

  //@Post('/connect')
  ////@Redirect('/private3') // Redirige automáticamente a la ruta privada después del inicio de sesión
  //async connect(@Body() loginUserDto, @Res() response) {
  //  const { token } = await this.authService.login(loginUserDto);
  //  response.json(token)
  //  return { token }; // Este retorno no se utilizará debido a la redirección
  //}

  @Post('/connect')
  @HttpCode(HttpStatus.OK)
  async connect(@Body() loginUserDto, @Res({ passthrough: true }) response) {
    const { token } = await this.authService.login(loginUserDto);

    // Establece la cookie con el token
    response.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Configura según tus necesidades

    return response.redirect('/products'); // Este retorno no se utilizará debido a la redirección
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
