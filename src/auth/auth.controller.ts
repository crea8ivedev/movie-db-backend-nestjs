import { Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req, @Res() res) {
    req.logIn(req.user, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
      if (!!req.body.rememberMe) {
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
      } else {
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
      }
      return res.json({
        message: "User login successfully",
      });
    });
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout();
    return { message: 'Logout successful' };
  }

  @Get('profile')
  profile(@Req() req) {
    return req.user;
  }
}
