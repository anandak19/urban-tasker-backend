export const USER_REGEX = {
  NAME: /^[A-Za-z\s]+$/, // Alphabets and spaces only
  PHONE_IN: /^\d{10}$/, // Indian phone numbers (10 digits)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, // Strong password
  EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // Simple email pattern
};
