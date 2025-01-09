import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class AuthService extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  async serializeUser(user: any, done: Function) {
    done(null, user._id);
  }
  
  async deserializeUser(id: string, done: Function) {
    const user = await this.userService.findUserById(id);
    const parsedUser = user.toJSON();
    delete parsedUser.password;
    done(null, parsedUser); 
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
