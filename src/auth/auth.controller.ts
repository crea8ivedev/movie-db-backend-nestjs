import { Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Login User',
    type: LoginDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User login successfully',
    schema: {
      example: {
        message: "User login successfully",
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: "Unauthorized",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        message: "Validation error",
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: {
        message: "Logout successful",
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Req() req) {
    req.logout();
    return { message: 'Logout successful' };
  }
}
