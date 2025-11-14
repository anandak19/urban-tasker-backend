export const CATEGORY_ERROR_MESSAGES = {
  NAME_REQUIRED: 'Category name is requred',
  NAME_INVALID: 'Category name should be string',
  NAME_MAX: 'Category name is too long!. Maximum 15 charecters allowed',

  IMAGE_REQUIRED: 'Category image is requred',
  IMAGE_LARGE: 'Image should be less than or equal to 1MB',
  IMAGE_FILE_INVALID: 'Only images of type jpg/jpeg/png are allowed',

  NOT_FOUND: 'Category Not found',
  NAME_CONFLICT: 'Category with the same name exists',
  CREATE_FAILD: 'Faild to create new category',
  IMG_UPLOAD_FAILD: 'Faild to upload category image',
  INVALID_NAME: 'Invalid category name',
  INVALID_FILE: 'Invalid image file type',

  FIND_ALL_FAILD: 'Faild to get all categories',
};

export const CATEGORY_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Category created succssfully',
  UPDATE_SUCCESS: 'Updated category successfully',

  FIND_ALL_SUCCESS: 'Categories fetched successfully',
};
