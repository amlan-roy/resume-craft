import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import { getIdToken } from "firebase/auth";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useSignup } from "@/lib/hooks/authentication/useSignup";
import { logout } from "@/lib/services/auth/logout";
import {
  addUserData,
  getUserFromEmail,
} from "@/lib/utils/firebase/database/users";
import {
  getMockAuth,
  getMockUser,
} from "@/lib/utils/test-helpers/hooks/authentication/authHelpers";

jest.mock("axios");

jest.mock("@/lib/utils/firebase/database/users", () => ({
  ...jest.requireActual("@/lib/utils/firebase/database/users"),
  getUserFromEmail: jest.fn(),
  addUserData: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  signInWithEmailAndPassword: jest.fn(),
  getIdToken: jest.fn(),
  EmailAuthProvider: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  getAuth: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  ...jest.requireActual("react-firebase-hooks/auth"),
  useSignInWithEmailAndPassword: jest.fn(),
  useSignInWithGoogle: jest.fn(),
  useCreateUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("@/lib/services/auth/logout", () => ({
  ...jest.requireActual("@/lib/services/auth/logout"),
  logout: jest.fn(),
}));

describe("useSignup", () => {
  let createUserWithEmailAndPasswordMock: jest.Mock;
  let signInWithGoogleMock: jest.Mock;
  let userIdTokenMock: jest.Mock;

  const mockEmail = "test@example.com";
  const mockPassword = "password";

  beforeEach(() => {
    jest.spyOn(console, "error");
    (console.error as jest.Mock).mockImplementation(() => null);

    signInWithGoogleMock = jest.fn();
    createUserWithEmailAndPasswordMock = jest.fn();
    userIdTokenMock = jest.fn();

    userIdTokenMock.mockResolvedValue(
      new Promise((resolve) => {
        resolve("token");
      })
    );

    createUserWithEmailAndPasswordMock.mockResolvedValue(
      new Promise((resolve) => {
        resolve({
          user: getMockUser({
            emailVerified: false,
            displayName: "test",
            email: mockEmail,
          }),
        });
      })
    );

    signInWithGoogleMock.mockResolvedValue(
      new Promise((resolve) => {
        resolve({
          user: getMockUser({
            emailVerified: true,
            displayName: "test",
            email: mockEmail,
            getIdToken: userIdTokenMock,
          }),
        });
      })
    );

    (useSignInWithGoogle as jest.Mock).mockReturnValue([
      signInWithGoogleMock,
      false,
      false,
      null,
    ]);
    (useCreateUserWithEmailAndPassword as jest.Mock).mockReturnValue([
      createUserWithEmailAndPasswordMock,
      false,
      false,
      null,
    ]);

    (getUserFromEmail as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(true))
    );

    (addUserData as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(true))
    );

    (getIdToken as jest.Mock).mockResolvedValue(
      new Promise((resolve) => {
        resolve("token");
      })
    );
    (axios.post as jest.Mock).mockResolvedValue({ status: 200 });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("should start unauthenticated", () => {
    const { result } = renderHook(() =>
      useSignup({
        auth: getMockAuth(),
      })
    );
    expect(result.current.authState).toBe("unauthenticated");
  });

  it("should handle signup with email", async () => {
    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(result.current.authState).toBe("authenticated");
  });

  it("should handle signup with email and not logout if email is not verified and email not verified flag is not passed", async () => {
    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(result.current.authState).toBe("authenticated");
    expect(logout).toHaveBeenCalledTimes(0);
  });

  it("should not call addUserData if user already exists", async () => {
    (getUserFromEmail as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(true))
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(addUserData).toHaveBeenCalledTimes(0);
  });

  it("should handle signup with email error [createUserWithEmailAndPassword failure]", async () => {
    createUserWithEmailAndPasswordMock.mockRejectedValue(
      new Error("An error occurred while signing up. Please try again.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with email error [getUserFromEmail failure]", async () => {
    (getUserFromEmail as jest.Mock).mockRejectedValue(
      new Error("An error occurred while getting user data.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with email error [addUserData failure]", async () => {
    (getUserFromEmail as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(false))
    );

    (addUserData as jest.Mock).mockRejectedValue(
      new Error("An error occurred while adding user data.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with email error [getIdToken failure]", async () => {
    (getIdToken as jest.Mock).mockRejectedValue(
      new Error("An error occurred while getting token.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with email error [axios post failure]", async () => {
    (axios.post as jest.Mock).mockRejectedValue(
      new Error("An error occurred while posting data.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithEmail(mockEmail, mockPassword);
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with google", async () => {
    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(result.current.authState).toBe("authenticated");
  });

  it("should handle signup with google and not logout if email is not verified and the flag is not provided", async () => {
    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(result.current.authState).toBe("authenticated");
    expect(logout).toHaveBeenCalledTimes(0);
  });

  it("should not call addUserData if user already exists", async () => {
    (getUserFromEmail as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(true))
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(addUserData).toHaveBeenCalledTimes(0);
  });

  it("should handle signup with google error [signInWithGoogle failure]", async () => {
    signInWithGoogleMock.mockRejectedValue(
      new Error("An error occurred while signing up. Please try again.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with google error [getUserFromEmail failure]", async () => {
    (getUserFromEmail as jest.Mock).mockRejectedValue(
      new Error("An error occurred while getting user data.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with google error [addUserData failure]", async () => {
    (addUserData as jest.Mock).mockClear();
    (addUserData as jest.Mock).mockRejectedValue(
      new Error("An error occurred while adding user data.")
    );
    (getUserFromEmail as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(false))
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with google error [getIdToken failure]", async () => {
    userIdTokenMock.mockRejectedValue(
      new Error("An error occurred while getting token.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(result.current.authState).toBe("error");
  });

  it("should handle signup with google error [axios post failure]", async () => {
    (axios.post as jest.Mock).mockRejectedValue(
      new Error("An error occurred while posting data.")
    );

    const { result } = renderHook(() => useSignup({ auth: getMockAuth() }));

    expect(result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await result.current.signupWithGoogle();
    });
    expect(result.current.authState).toBe("error");
  });
});
