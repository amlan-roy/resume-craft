import { renderHook } from "@testing-library/react";
import axios from "axios";
import firebaseAuth from "firebase/auth";
import { act } from "react-dom/test-utils";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useLogin } from "@/lib/hooks/authentication/useLogin";
import { logout } from "@/lib/services/auth/logout";

jest.mock("axios");

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  signInWithEmailAndPassword: jest.fn(),
  getIdToken: jest.fn(),
}));

jest.mock("@/lib/services/auth/logout", () => ({
  ...jest.requireActual("@/lib/services/auth/logout"),
  logout: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  ...jest.requireActual("react-firebase-hooks/auth"),
  useSignInWithGoogle: jest.fn(),
}));

const getMockAuth = ({ currentUser = null, ...rest } = {}) =>
  ({
    currentUser,
    signOut: jest.fn(),
    ...rest,
  }) as any;

const getMockUser = ({ emailVerified = false, ...rest } = {}) =>
  ({
    emailVerified,
    ...rest,
  }) as any;

const getMockRouter = () =>
  ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }) as any;

describe("useLogin", () => {
  let signInWithGoogleMock: jest.Mock;
  beforeEach(() => {
    signInWithGoogleMock = jest.fn();
    // Mock the axios post request
    (useSignInWithGoogle as jest.Mock).mockReturnValue([
      signInWithGoogleMock,
      false,
      false,
      null,
    ]);
    (axios.post as jest.Mock).mockResolvedValue({ status: 200 });
  });

  it("should start unauthenticated", () => {
    const mockAuth = getMockAuth();
    const { result } = renderHook(() =>
      useLogin({
        auth: mockAuth,
      })
    );

    expect(result.current.authState).toBe("unauthenticated");
  });

  it("should handle email authentication", async () => {
    const mockAuth = getMockAuth();

    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      new Promise((resolve) => {
        resolve({ user: getMockUser({ emailVerified: true }) });
      })
    );

    (firebaseAuth.getIdToken as jest.Mock).mockResolvedValue(
      new Promise((resolve) => {
        resolve("token");
      })
    );

    (axios.post as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve({ status: 200 }))
    );

    const renderHookResponse = renderHook(() =>
      useLogin({
        auth: mockAuth,
      })
    );

    const mockEmail = "test@example.com";
    const mockPassword = "password";

    expect(renderHookResponse.result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await renderHookResponse.result.current.useEmailAuth(
        mockEmail,
        mockPassword
      );
    });
    expect(renderHookResponse.result.current.authState).toBe("authenticated");
    expect(renderHookResponse.result.current.isEmailVerified).toBe(true);
  });

  it("should handle email authentication error [signInWithEmailAndPassword failure]", async () => {
    const mockAuth = getMockAuth();

    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error("An error occurred")
    );

    const renderHookResponse = renderHook(() =>
      useLogin({
        auth: mockAuth,
      })
    );

    const mockEmail = "meraDilBhi@kitnaPagalHai.com";
    const mockPassword = "password";

    expect(renderHookResponse.result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await renderHookResponse.result.current.useEmailAuth(
        mockEmail,
        mockPassword
      );
    });
    expect(renderHookResponse.result.current.authState).toBe("error");

    // Should not call logout when the first firebase signin step fails
    expect(logout).toHaveBeenCalledTimes(0);
  });

  it("should handle email authentication error [getIdToken failure]", async () => {
    const mockAuth = getMockAuth();

    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      new Promise((resolve) => {
        resolve({ user: getMockUser({ emailVerified: true }) });
      })
    );

    (firebaseAuth.getIdToken as jest.Mock).mockRejectedValue(
      new Error("An error occurred")
    );

    const renderHookResponse = renderHook(() =>
      useLogin({
        auth: mockAuth,
      })
    );

    const mockEmail = "oHaseena@zulfonWali.com";
    const mockPassword = "password";

    expect(renderHookResponse.result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await renderHookResponse.result.current.useEmailAuth(
        mockEmail,
        mockPassword
      );
    });
    expect(renderHookResponse.result.current.authState).toBe("error");

    // Should not call logout when the second firebase getIdToken step fails
    expect(logout).toHaveBeenCalledTimes(0);
  });

  it("should handle email authentication error [getIdToken does not return valid value]", async () => {
    const mockAuth = getMockAuth();

    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      new Promise((resolve) => {
        resolve({ user: getMockUser({ emailVerified: true }) });
      })
    );

    (firebaseAuth.getIdToken as jest.Mock).mockResolvedValue(undefined);

    const renderHookResponse = renderHook(() =>
      useLogin({
        auth: mockAuth,
      })
    );

    const mockEmail = "oHaseena@zulfonWali.com";
    const mockPassword = "password";

    expect(renderHookResponse.result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await renderHookResponse.result.current.useEmailAuth(
        mockEmail,
        mockPassword
      );
    });
    expect(renderHookResponse.result.current.authState).toBe("error");

    // Should not call logout when the second firebase getIdToken step fails
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("should handle email authentication error [axios post failure]", async () => {
    const mockAuth = getMockAuth();

    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      new Promise((resolve) => {
        resolve({ user: getMockUser({ emailVerified: true }) });
      })
    );

    (firebaseAuth.getIdToken as jest.Mock).mockResolvedValue(
      new Promise((resolve) => {
        resolve("token");
      })
    );

    (axios.post as jest.Mock).mockRejectedValue(new Error("An error occurred"));

    const renderHookResponse = renderHook(() =>
      useLogin({
        auth: mockAuth,
      })
    );

    const mockEmail = "jabba@aaaa.com";
    const mockPassword = "password";

    expect(renderHookResponse.result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await renderHookResponse.result.current.useEmailAuth(
        mockEmail,
        mockPassword
      );
    });
    expect(renderHookResponse.result.current.authState).toBe("error");

    // Should not call logout when the axios post request fails
    expect(logout).toHaveBeenCalledTimes(0);
  });

  it("should call onError when an error occurs in email auth", async () => {
    const mockAuth = getMockAuth();

    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error("An error occurred")
    );

    const onError = jest.fn();

    const renderHookResponse = renderHook(() =>
      useLogin({
        auth: mockAuth,
        onError,
      })
    );

    const mockEmail = "paappap@kjbf.com";
    const mockPassword = "password";

    expect(renderHookResponse.result.current.authState).toBe("unauthenticated");
    await act(async () => {
      await renderHookResponse.result.current.useEmailAuth(
        mockEmail,
        mockPassword
      );
    });
    expect(renderHookResponse.result.current.authState).toBe("error");
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("should call the signInWithGoogle function when useGoogleAuth is called", async () => {
    const mockAuth = getMockAuth();

    const renderHookResponse = renderHook(() =>
      useLogin({
        auth: mockAuth,
      })
    );

    await act(async () => {
      await renderHookResponse.result.current.useGoogleAuth();
    });

    expect(signInWithGoogleMock).toHaveBeenCalledTimes(1);
  });

  // Todo: Add more google auth tests
});
