import { BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

export const ImageUploadInterceptor = (fieldName = 'images', maxCount = 5) => {
  return FilesInterceptor(fieldName, maxCount, {
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only images allowed'), false);
      }

      cb(null, true);
    },
    limits: {
      fileSize: 1 * 1024 * 1024,
    },
  });
};
