import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from './dto/find-all.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    if (
      (!createUserDto.email && !createUserDto.phone) ||
      (createUserDto.email && createUserDto.phone)
    )
      throw new BadRequestException('Either email or phone must be provided');
    if (!createUserDto.password)
      throw new BadRequestException('Password is required');

    const whereCondition: {
      email?: string;
      phone?: string;
    } = {};

    if (createUserDto.email) whereCondition.email = createUserDto.email;
    if (createUserDto.phone) whereCondition.phone = createUserDto.phone;

    const isUserExist = await this.userModel.findOne({
      where: whereCondition,
    });

    if (isUserExist) throw new BadRequestException('User already exists');

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const newUser = {
      name: createUserDto.name,
      email: createUserDto.email ? createUserDto.email : null,
      phone: createUserDto.phone ? createUserDto.phone : null,
      password: createUserDto.password,
    };

    this.userModel.create(newUser);

    return 200;
  }

  async signIn(signInDto: SignInDto) {
    if (
      (!signInDto.email && !signInDto.phone) ||
      (signInDto.email && signInDto.phone) ||
      !signInDto.password
    ) {
      throw new BadRequestException('Invalid credentials');
    }

    const whereCondition: {
      email?: string;
      phone?: string;
    } = {};

    if (signInDto.email) whereCondition.email = signInDto.email;
    if (signInDto.phone) whereCondition.phone = signInDto.phone;

    const user = await this.userModel.findOne({
      where: whereCondition,
    });

    if (!user) throw new UnauthorizedException();

    const userPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      userPassword,
    );
    if (!isPasswordMatch) throw new UnauthorizedException();
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: this.configService.get('JWT_EXPIRES_IN', { infer: true }) },
    );
    return accessToken;
  }

  async findAll(findAllDto: FindAllDto) {
    const whereCondition: {
      email?: string;
      phone?: string;
      name?: string;
    } = {};

    if (findAllDto.email !== undefined) whereCondition.email = findAllDto.email;
    if (findAllDto.phone !== undefined) whereCondition.phone = findAllDto.phone;
    if (findAllDto.name !== undefined) whereCondition.name = findAllDto.name;

    const offset = findAllDto.page
      ? (findAllDto.page - 1) * findAllDto.limit
      : null;

    const users = await this.userModel.findAll({
      where: whereCondition,
      offset: offset,
      limit: findAllDto.limit,
    });
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);

    const toUpdate: {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
    } = {};

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.name) toUpdate.name = updateUserDto.name;
    if (updateUserDto.email) toUpdate.email = updateUserDto.email;
    if (updateUserDto.password) toUpdate.password = updateUserDto.password;
    if (updateUserDto.phone) toUpdate.phone = updateUserDto.phone;

    const whereCondition = [];

    if (updateUserDto.email && updateUserDto.email !== user.email)
      whereCondition.push({ email: updateUserDto.email });
    if (updateUserDto.phone && updateUserDto.phone !== user.phone)
      whereCondition.push({ phone: updateUserDto.phone });

    const isUserExist = await this.userModel.findOne({
      where: {
        [Op.or]: whereCondition,
      },
    });

    if (isUserExist) throw new BadRequestException('Unable to update user');

    await user.update(toUpdate);

    return 200;
  }

  async remove(id: number) {
    await this.userModel.destroy({ where: { id } });
    return 200;
  }
}
