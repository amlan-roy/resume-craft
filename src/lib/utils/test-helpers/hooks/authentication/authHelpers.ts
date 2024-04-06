import { Auth, User } from "firebase/auth";

const getMockAuth = ({
  currentUser = null,
  ...rest
}: {
  currentUser?: User | null;
  [key: string]: any;
} = {}) =>
  ({
    currentUser,
    signOut: jest.fn(),
    ...rest,
  }) as any as Auth;

const getMockUser = ({
  emailVerified = false,
  ...rest
}: {
  emailVerified?: boolean;
  [key: string]: any;
} = {}) =>
  ({
    emailVerified,
    ...rest,
  }) as User;

const getMockRouter = () =>
  ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }) as any;

export { getMockAuth, getMockUser, getMockRouter };
