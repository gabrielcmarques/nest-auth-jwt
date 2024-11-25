import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [AppController, PostsController],
  providers: [AppService, PostService],
})
export class AppModule {}
