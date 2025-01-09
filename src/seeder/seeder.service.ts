import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(private readonly userService: UserService) {}

  async seedUsers(): Promise<User[]> {
    const password = await bcrypt.hash('12345678', 10);

    const users = [
      { email: 'test@gmail.com', password, name: 'John Doe' },
      { email: 'test2@gmail.com', password, name: 'John Doe' },
    ];

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const existingUser = await this.userService.findUserByEmail(user.email);
      if (!existingUser) {
        const newUser = await this.userService.createUser(
          user.email,
          user.password,
          user.name,
        );
        createdUsers.push(newUser);
      }
    }

    return createdUsers;
  }
}
