import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from './dto/find-all.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User sign up' })
  @ApiCreatedResponse({
    description: 'The user has been successfully signed up.',
  })
  @ApiBadRequestResponse({
    description:
      'Either email or phone must be provided, or password is required.',
  })
  @ApiConflictResponse({ description: 'User already exists.' })
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  @ApiOperation({ summary: 'User sign in' })
  @ApiOkResponse({
    description:
      'User has been successfully signed in and access token is returned.',
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials.' })
  @ApiUnauthorizedResponse({
    description: 'User not found or password does not match.',
  })
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Find all users' })
  @ApiOkResponse({
    description: 'List of users has been successfully retrieved.',
  })
  @UseGuards(AuthGuard)
  @Get('find')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() findAllDto: FindAllDto) {
    return this.usersService.findAll(findAllDto);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: 'User profile has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Unable to update user.' })
  @UseGuards(AuthGuard)
  @Patch('update')
  update(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: number) {
    return this.usersService.update(user, updateUserDto);
  }

  @ApiOperation({ summary: 'Remove user' })
  @ApiOkResponse({ description: 'User has been successfully removed.' })
  @UseGuards(AuthGuard)
  @Delete('remove')
  remove(@CurrentUser() user: number) {
    return this.usersService.remove(user);
  }
}
