import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseIdDto } from 'src/shared/dtos/responseId.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findOneByCriteria(criteria: Partial<User>): Promise<User> {
    this.logger.debug('findOneByCriteria', criteria);
    return this.userRepository.findOne(criteria as any);
  }

  async createUser(createUserDto: CreateUserDto): Promise<ResponseIdDto> {
    this.logger.debug('createUser');

    const user = await this.findOneByCriteria({ email: createUserDto.email });

    if (user) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists.`,
      );
    }

    const newUser = this.userRepository.create(createUserDto);

    const { id } = await this.userRepository.save(newUser);

    return { id };
  }
}
