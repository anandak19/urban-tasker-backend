import { Express } from 'express';

export interface IS3Service {
  /**
   * Return signed url of the image in s3
   * @param key
   */
  getImageUrl(key: string): Promise<string>;

  /**
   * Upload category image
   * @param file
   */
  uploadCategoryImage(file: Express.Multer.File): Promise<string>;
}
