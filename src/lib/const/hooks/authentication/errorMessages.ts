const ERROR_CODE: {
  [key: string]: string;
} = {
  INVALID_CREDENTIALS: "auth/invalid-credential",
  TOO_MANY_REQUESTS: "auth/too-many-requests",
  EMAIL_ALREADY_IN_USE: "auth/email-already-in-use",
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIALS:
    "auth/account-exists-with-different-credential",
  CREDENTIAL_ALREADY_IN_USE: "auth/credential-already-in-use",
  UNKNOWN: "unknown",
};

const ERROR_MESSAGE = {
  [ERROR_CODE.INVALID_CREDENTIALS]: {
    title: "Invalid credentials",
    message: "The email or password you entered is incorrect.",
  },
  [ERROR_CODE.TOO_MANY_REQUESTS]: {
    title: "Too many requests",
    message:
      "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later",
  },
  [ERROR_CODE.UNKNOWN]: {
    title: "An error occurred",
    message: "An error occurred while logging in. Please try again.",
  },
  [ERROR_CODE.EMAIL_ALREADY_IN_USE]: {
    title: "Email already in use",
    message:
      "An account already exists with this email address. Try using a different email address.",
  },
  [ERROR_CODE.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIALS]: {
    title: "Account exists with different credentials",
    message:
      "Account already exists with different credentials. Try logging in instead.",
  },
  [ERROR_CODE.CREDENTIAL_ALREADY_IN_USE]: {
    title: "Account exists",
    message: "Account already exists. Try logging in instead.",
  },
};

export { ERROR_MESSAGE, ERROR_CODE };
