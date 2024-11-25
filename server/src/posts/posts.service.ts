import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new post
  async createPost(createPostDto: CreatePostDto) {
    // console.log(`createPost() @ post.service.ts: userId`, userId);

    // if (!userId) {
    //   throw new Error('Invalid userId. User ID must be provided');
    // }

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        // title: createPostDto.title,
        // description: createPostDto.description,
        // content: createPostDto.content,
        // userId: userId,
        // title: 'Test Post',
        // description: 'Test Description',
        // content: 'This is a test content.',
        // userId: 5, // Replace with a valid user ID in your database
      },
    });
  }

  // Get all posts for the logged-in user
  async getPosts(userId: number) {
    return this.prisma.post.findMany({
      where: {
        userId: Number(userId + 1),
      },
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deletePost(id: number, userId: any) {
    const post = await this.prisma.post.findUnique({
      where: { id: +id },
    });

    console.log('POST ID:', post);

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if the current user is the owner of the post (i.e., matches the userId)
    if (post.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post.');
    }

    // Proceed with deleting the post
    await this.prisma.post.delete({
      where: { id: +id },
    });
  }
}
