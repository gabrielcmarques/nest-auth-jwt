import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
// import { LocalAuthGuard } from '../local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    return this.authService.register(email, password, name);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const result = await this.authService.login(email, password);

    console.log(`RESULT @POSTLOGIN ${result}`);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user, // User object is now included in the response
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { userId: number; refreshToken: string }) {
    const user = await this.authService.validateRefreshToken(
      body.userId,
      body.refreshToken,
    );

    const accessToken = this.authService.generateAccessToken(
      user.id,
      user.email,
    );
    return { accessToken };
  }
}
