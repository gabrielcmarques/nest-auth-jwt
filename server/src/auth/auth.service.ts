import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  // UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: number; email: string; name: string }; // Include user in return type
  }> {
    const user = await this.validateUser(email, password); // Retrieve user details

    if (!user) {
      console.log('AUTH.SERVICE; login(); USER NOT FOUND OR PASSWORD MISMATCH');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(user);

    const payload = { id: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async generateAccessToken(userId: number, email: string) {
    const payload = { id: userId, email };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    return user;
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userService.registerUser(email, password, name);

    return {
      message: 'User registered successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Validate user credentials for login
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    console.log(
      `auth.service; validateUser() user: \n ${JSON.stringify(user, null, 2)}`,
    );

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(
        `auth.service; validateUser(): USER AND PASSWORD OK: \n ${user}`,
      );
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }

    console.log(`auth.service; validateUser(): return NULL: \n ${user}`);

    return null; // Return null if user not found or password mismatch
  }
}
