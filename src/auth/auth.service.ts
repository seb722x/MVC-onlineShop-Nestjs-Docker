import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

 
  async create( createUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.usersRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ),
        
      });
      return await this.usersRepository.save( user )
      //delete user.password;
      //return {
      //  ...user,
      //  token: this.getJwtToken({ id: user.id })
      //};
      //// TODO: Retornar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login( loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, role:true } //! OJO!
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');
      const token1 =   this.getJwtToken({ id: user.id,role:user.role })
      console.log(token1);
      
    return {
      ...user,
      token: this.getJwtToken({ id: user.id, role:user.role})
    };
    console.log(user);
    
    //if (user) {
    //  request.session.user = {
    //    id: user.id,
    //    name: user.name,
    //    role: user.role,
    //  };
    //  return response.redirect('/');
    //} else {
    //  return response.redirect('/auth/login');
    //}
  }


  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  updateBalance(id: number, balance: number) {
    return this.usersRepository.update(id, { balance: balance });
  }

  async update(id: number, updateProduct){
    const {name, balance, email, roles} = updateProduct
    const user = await this.findOne(+id);
    user.setName(name);
    user.setEmail(email);
    user.setRole(roles);
    user.setBalance(balance)
    return this.usersRepository.save(user);

  }

  
  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error: any ): never {


    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }

}



 //async createOrUpdate(user: User): Promise<User> {
  //  const hash = await bcrypt.hash(user.getPassword(), 10);
  //  user.setPassword(hash);
  //  return this.usersRepository.save(user);
  //}
