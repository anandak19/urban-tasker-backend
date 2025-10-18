export const USER_REGEX = {
  NAME: /^[A-Za-z\s]+$/, // Alphabets and spaces only
  PHONE_IN: /^[6-9]\d{9}$/, // Indian phone numbers (10 digits, starts 6-9)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, // Strong password
  EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // Simple email pattern
};
