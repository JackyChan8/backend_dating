import {
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFiles,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/auth/auth.guard';

import {
  UploadMultiFile,
  UploadSingleFile,
} from 'src/utils/decorators/uploadFiles';
import { storage } from 'src/utils/storage/storage';

import { UsersService } from './users.service';
import { PhotoService } from './modules/photo/photo.service';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly photoService: PhotoService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Photo uploaded successfully',
  })
  @ApiResponse({
    status: 500,
    description:
      'An error occurred while add photo to database | An error occurred while add photo',
  })
  @ApiOperation({ summary: 'Upload Photo' })
  @ApiBearerAuth('JWT-auth')
  @Post('photo/upload')
  @ApiConsumes('multipart/form-data')
  @UploadSingleFile()
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif|webp)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    // Get User
    const user = await this.userService.findByID(req.user.sub);
    if (user) {
      // Add Photo
      const addPhoto = await this.photoService.create(user, file.filename);
      if (addPhoto) {
        return {
          statusCode: 201,
          message: 'Photo uploaded successfully',
        };
      } else {
        throw new HttpException(
          'An error occurred while add photo to database',
          500,
        );
      }
    } else {
      throw new HttpException('An error occurred while add photo', 500);
    }
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Photos uploaded successfully',
  })
  @ApiResponse({
    status: 500,
    description:
      'An error occurred while add photos to database | An error occurred while add photos',
  })
  @ApiOperation({ summary: 'Uploads Photo' })
  @ApiBearerAuth('JWT-auth')
  @Post('photos/upload')
  @ApiConsumes('multipart/form-data')
  @UploadMultiFile()
  @UseInterceptors(FilesInterceptor('files', 20, { storage }))
  async uploadFiles(
    @Request() req: any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif|webp)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    // Get User
    const user = await this.userService.findByID(req.user.sub);
    if (user) {
      // Add Photos
      const filenames = files.map((f) => f.filename);
      const addPhotos = await this.photoService.createMultiple(user, filenames);
      if (addPhotos) {
        return {
          statusCode: 201,
          message: 'Photos uploaded successfully',
        };
      } else {
        throw new HttpException(
          'An error occurred while add photos to database',
          500,
        );
      }
    } else {
      throw new HttpException('An error occurred while add photos', 500);
    }
  }
}
