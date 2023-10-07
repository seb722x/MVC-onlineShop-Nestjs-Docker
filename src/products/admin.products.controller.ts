import {
  Controller,
  Get,
  Render,
  Post,
  Delete,
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
import { ProductsService } from 'src/products/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('/admin')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  
  @Get('/')
  @Auth( ValidRoles.admin )
  @Render('admin/index')
  indexAdmin() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Admin - Online Store';
    return {
      viewData: viewData,
    };
  }

 
  @Get('products/')
  @Auth( ValidRoles.admin )
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
  @Auth( ValidRoles.admin )
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products')
  async store(
    @Body() body:CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
     await this.productsService.create(body,file);
     console.log(body);
     
  }

  @Delete('products/delete/:id')
  @Redirect('/admin/products')
  remove(@Param('id') id: string) {
    console.log(id);
    
    return this.productsService.remove(+id);
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

  @Patch('products/:id/update')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  async update(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Res() response,
  ) {
    
   
     await this.productsService.update(id,body,file);
     return response.redirect('/admin/products/');
    ///TODO this is because it was failing
  }

 







}
