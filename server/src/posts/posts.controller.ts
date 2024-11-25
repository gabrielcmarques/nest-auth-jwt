import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get('user/:userId')
  async getUserPosts(@Param('userId') userId: number) {
    return this.postService.getPosts(userId);
  }

  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deletePost(@Param('id') id: number, @Body() body: any) {
    // console.log(body.userId);
    const userId = body.userId; // Use userId from the request body
    return this.postService.deletePost(id, userId);
  }
}
