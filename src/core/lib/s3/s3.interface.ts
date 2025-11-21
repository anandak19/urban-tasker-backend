import { Express } from 'express';

export interface IS3Service {
  /**
   * Return signed url of the image in s3
   * @param key
   */
  getImageUrl(key: string): Promise<string>;

  /**
   * Upload category image to /categories foler in bucket
   * @param file
   */
  uploadCategoryImage(file: Express.Multer.File): Promise<string>;

  /**
   * Upload sub category image to /subcategories foler in bucket
   * @param file
   */
  uploadSubCategoryImage(file: Express.Multer.File): Promise<string>;
}
