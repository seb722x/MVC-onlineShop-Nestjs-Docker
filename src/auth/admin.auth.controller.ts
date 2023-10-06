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
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Product } from '../models/product.entity';
  import * as fs from 'fs';
  import { ProductsService } from 'src/products/products.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
  
  @Controller('/admin')
  export class AdminUsersController {
    constructor(private readonly authService: AuthService) {}
  
    
  
    @Get('users/')
    @Render('admin/users/index')
    async index() {
      const  users= await this.authService.findAll();
          
      return {
        users
      };
    }

  
    @Post('users/store')
    @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
    @Redirect('/admin/users')
    async store(
        @Body() body,
        @UploadedFile() file: Express.Multer.File,
        @Req() request,
    ) {
  
    console.log(body);
    
     await this.authService.create(body);
    
    }
    @Get('users/:id')
    @Render('admin/users/edit')
    async edit(@Param('id') id: string) {
     const users = await this.authService.findOne(+id);
      console.log(users);
      return {
        users
      };
      
      
    }

    @Post('users/:id/update')
    @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
    async update(
      @Body() body,
      @UploadedFile() file: Express.Multer.File,
      @Param('id') id: number,
      @Req() request,
      @Res() response,
    ) {
      
     console.log(body);
     
      await this.authService.update(id,body);
       return response.redirect('/admin/users/');
      //}///TODO this is because was failing
    }
  }  