import {
  Body,
  Controller,
  Get,
  Param,
  NotFoundException,
  Delete,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.register(createUserDto);
    } catch (error) {
      this.usersService.handleDBErrors(error);
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  async getAll(@GetUser() user: User) {
    const result = await this.usersService.getAll();
    return result.filter(
      (oneUser) => oneUser._id.toString() !== user._id.toString(),
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const user = await this.usersService.getOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const user = await this.usersService.delete(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch()
  @UseGuards(AuthGuard())
  async update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const userUpdated = await this.usersService.update(user._id, updateUserDto);
    if (!userUpdated) throw new NotFoundException('User not found');
    return userUpdated;
  }

  @Patch(':id')
  async inActivate(@Param('id') id: string) {
    const user = await this.usersService.inActivate(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
