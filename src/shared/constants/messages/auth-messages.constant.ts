export const AUTH_MESSAGES = {
  FIRSTNAME_REQUIRED: 'First name is required.',
  FIRSTNAME_STRING: 'First name must be a string.',
  FIRSTNAME_MIN: 'First name must have at least 2 characters.',
  FIRSTNAME_MAX: 'First name cannot exceed 30 characters.',
  FIRSTNAME_INVALID: 'First name should only contain letters and spaces.',

  LASTNAME_REQUIRED: 'Last name is required.',
  LASTNAME_STRING: 'Last name must be a string.',
  LASTNAME_MIN: 'Last name must have at least 1 characters.',
  LASTNAME_MAX: 'Last name cannot exceed 30 characters.',
  LASTNAME_INVALID: 'Last name should only contain letters and spaces.',

  EMAIL_REQUIRED: 'Email is required.',
  INVALID_EMAIL: 'Invalid email format.',
  EMAIL_MAX: 'Email cannot exceed 60 characters.',
  EMAIL_TAKEN: 'This email is already taken.',
  NOT_VERIFIED: 'Email is not verified',
  EMAIL_NOT_FOUND: 'User not found with this email',

  PHONE_REQUIRED: 'Phone number is required.',
  INVALID_PHONE: 'Invalid phone number.',
  INVALID_PHONE_FORMAT: 'Phone number must be a valid 10-digit Indian number.',

  //STEP2
  OTP_REQUIRED: 'OTP is required',
  OTP_STRING: 'OTP must be string',
  OTP_LENGTH: 'OTP must be 4 charecter long',
  OTP_EXPIRED: 'Invalid or expired OTP. Click resend to get new one',

  //STEP3
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN: 'Password should be atleast 5 charecters',
  PASSWORD_MAX: 'Password cannot exceed 15 charecters',
  PASSWORD_INVALID_FORMAT:
    'Password must include uppercase, lowercase, and number characters',
  PASSWORD_INCORRECT: 'Incorrect password, please enter correct password',

  LOGIN_SUCCESS: 'User login success',
  LOGIN_FAILD: 'Faild to login',

  SIGNUP_FAILD: 'Signup faild, please try again later',
  SIGNUP_SUCCESS: 'Account created successfully, please login to continue',

  UNAUTH_USER: 'Unauthorized user',

  ADMIN_ONLY: 'Access denied, only admins can perform this action',
};

export const SESSION_MESSAGES = {
  SIGNUP_EXPIRED: 'Signup session expired. Please restart signup.',
};
