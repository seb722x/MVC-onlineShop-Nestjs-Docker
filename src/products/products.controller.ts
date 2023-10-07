import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('products/index')
  async index() {
    const products = await this.productsService.findAll();
    return {products}
    
  }

  @Get('/:id')
  @Render('products/show')
  async show(@Param() params, @Res() response) {
    const product = await this.productsService.findOne(params.id);
    console.log(product);
    if (product === null) {
      return response.redirect('/products');
    }
    return {product}; 
  }
}
