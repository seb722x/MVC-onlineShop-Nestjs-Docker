import {
    Controller,
    Get,
    Render,
    Post,
    Body,
    Redirect,
    UseInterceptors,
    UploadedFile,
    Param,
    Req,
    Res,
    Patch,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
 
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces';
  
  @Controller('/admin')
  export class AdminUsersController {
    constructor(private readonly authService: AuthService) {}
  
    
   
    @Get('users/')
    @Auth( ValidRoles.admin )
    @Render('admin/users/index')
    async index() {
      const  users= await this.authService.findAll();
      return {
        users
      };
    }

  
    @Post('users/store')
    @Auth( ValidRoles.admin )
    @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
    @Redirect('/admin/users')
    async store(
        @Body() body:CreateUserDto,
        @UploadedFile() file: Express.Multer.File,
    ) {    
     await this.authService.create(body);
    
    }
    @Get('users/:id')
    @Auth( ValidRoles.admin )
    @Render('admin/users/edit')
    async edit(@Param('id') id: string) {
     const users = await this.authService.findOne(+id);
      console.log(users);
      return {
        users
      };
      
      
    }

    
  @Post('user/delete/:id')
  @Redirect('/admin/users')
  remove(@Param('id') id: number) {
    console.log(id);
    
    return this.authService.remove(id);
  }

    @Post('users/:id/update')
    @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
    async update(
      @Body() body,
      @UploadedFile() file: Express.Multer.File,
      @Param('id') id: number,
      @Res() response,
    ) {
         
      await this.authService.update(id,body);
       return response.redirect('/admin/users/');
      //}///TODO this is because was failing
    }
  }  