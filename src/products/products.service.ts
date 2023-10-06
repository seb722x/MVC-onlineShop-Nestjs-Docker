import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    const product = this.productsRepository.findOneBy({ id: id });
    if (!product) throw new NotFoundException(`Product with ${id} not found`);
    return product;
  }

  create(product: CreateProductDto,file): Promise<Product> {
    const {name,description, price} = product 
    const newProduct = new Product();
      newProduct.setName(name);
      newProduct.setDescription(description);
      newProduct.setPrice(price);
      newProduct.setImage(file.filename);
    //const createProduct = this.productsRepository.create({...product})
    return this.productsRepository.save(newProduct);
  }

  async update(id: number, updateProduct:UpdateProductDto,file){
    const {name, description, price} = updateProduct
    const product = await this.findOne(+id);
    product.setName(name);
    product.setDescription(description);
    product.setPrice(price);
    if (file) {
      product.setImage(file.filename);
    }
    return this.productsRepository.save(product);

  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }

  findByIds(ids: string[]): Promise<Product[]> {
    return this.productsRepository.findByIds(ids);
  }
}
