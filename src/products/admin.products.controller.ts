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
import { CreateProductDto } from './dto/create-product.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('/admin')
@Auth( ValidRoles.admin )
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  
  @Get('/')
 // @Auth( ValidRoles.admin )
  @Render('admin/index')
  indexAdmin() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Admin - Online Store';
    return {
      viewData: viewData,
    };
  }

 
  @Get('products/')
  //@Auth( ValidRoles.admin )
  @Render('admin/products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Admin - Online Store';
    viewData['products'] = await this.productsService.findAll();
    return {
      viewData: viewData,
    };
  }

  @Post('products/store')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products')
  async store(
    @Body() body:CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ) {
  
    console.log(body);
    
     await this.productsService.create(body,file);
    
  }

  @Post('products/:id')
  @Redirect('/admin/products')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('products/:id')
  @Render('admin/products/edit')
  async edit(@Param('id') id: string) {
    const viewData = [];
    viewData['title'] = 'Admin Page - Edit Product - Online Store';
    viewData['product'] = await this.productsService.findOne(+id);
    console.log(viewData);
    return {
      viewData: viewData,
    };
    
    
  }

  @Post('products/:id/update')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  async update(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Req() request,
    @Res() response,
  ) {
    
   
     await this.productsService.update(id,body,file);
     return response.redirect('/admin/products/');
    ///TODO this is because it was failing
  }

 







}
