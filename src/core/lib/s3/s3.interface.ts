import 'multer';

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

  /**
   * Upload id proofs
   * @param file
   */
  uploadIdProofImage(file: Express.Multer.File): Promise<string>;

  /**
   * Upload user profile pic
   * @param file
   */
  uploadUserProfilePic(file: Express.Multer.File): Promise<string>;

  /**
   * Upload portfolio image
   * @param file
   */
  uploadPortfolioImage(file: Express.Multer.File): Promise<string>;

  /**
   * Upload image in message
   * @param file
   */
  uploadMessageImage(file: Express.Multer.File): Promise<string>;

  /**
   * Upload complaint images
   * @param file
   */
  uploadComplaintImage(file: Express.Multer.File): Promise<string>;
}
