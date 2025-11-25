export const CATEGORY_ERROR_MESSAGES = {
  NAME_REQUIRED: 'Category name is requred',
  NAME_INVALID: 'Category name should be string',
  NAME_MAX: 'Category name is too long!. Maximum 15 charecters allowed',

  IMAGE_REQUIRED: 'Category image is requred',

  NOT_FOUND: 'Category Not found',
  NAME_CONFLICT: 'Category with the same name exists',
  CREATE_FAILD: 'Faild to create new category',
  IMG_UPLOAD_FAILD: 'Faild to upload category image',
  INVALID_NAME: 'Invalid category name',
  INVALID_FILE: 'Invalid image file type',

  FIND_ALL_FAILD: 'Faild to get all categories',
  UPDATE_FAILD: 'Faild to update category',
};

export const CATEGORY_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Category created succssfully',
  UPDATE_SUCCESS: 'Updated category successfully',
  CHANGE_IS_ACTIVE_SUCCESS: 'Updated active status successfully',
  DELETE_ONE_SUCCESS: 'Category Deleted Successfully',

  FIND_ALL_SUCCESS: 'Categories fetched successfully',
};

// sub category

export const SUBCATEGORY_ERROR_MESSAGES = {
  NOT_FOUND: 'Sub-Category Not found',
  NAME_CONFLICT: 'A Sub-Category with the same name exists',
  DESCRIPTION_REQUIRED: 'Description is required',
  CATEGORYID_REQUIRED: 'Please select a valid category',
  CREATE_FAILD: 'Faild to create new sub-category',
  FIND_ALL_FAILD: 'Faild to get all sub-categories',
  UPDATE_FAILD: 'Faild to update sub category',
};

export const SUBCATEGORY_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Sub-Category created succssfully',
  UPDATE_SUCCESS: 'Updated sub-category successfully',
  CHANGE_IS_ACTIVE_SUCCESS: 'Updated active status successfully',
  DELETE_ONE_SUCCESS: 'Sub-Category Deleted Successfully',

  FIND_ALL_SUCCESS: 'Sub-Categories fetched successfully',
};
