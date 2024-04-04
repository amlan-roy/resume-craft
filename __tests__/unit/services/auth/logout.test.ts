import { useRouter } from "next/navigation";
import axios from "axios";
import { Auth } from "firebase/auth";
import { logout } from "@/lib/services/auth/logout";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");

describe("logout", () => {
  let mockAuth: jest.Mocked<Auth>;
  let mockRouter: ReturnType<typeof useRouter>;
  let mockOnError: jest.Mock;

  beforeEach(() => {
    mockAuth = {
      currentUser: {
        isEmailVerified: true,
      },
      signOut: jest.fn(),
    } as any;
    mockRouter = {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
    mockOnError = jest.fn();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (axios.post as jest.Mock).mockResolvedValue({ status: 200 });
  });

  it("should sign out the current user and make a logout request", async () => {
    await logout(mockAuth, mockRouter);

    expect(mockAuth?.signOut).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/api/logout");
  });

  it("should redirect to the login page if the logout request is successful, and redirect is not passed and path is not given", async () => {
    await logout(mockAuth, mockRouter, mockOnError);

    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("should not redirect if the redirect flag is set to false", async () => {
    await logout(mockAuth, mockRouter, mockOnError, false);

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("should redirect to the specified path if the redirect flag is set to true", async () => {
    await logout(mockAuth, mockRouter, mockOnError, true, "/home");

    expect(mockRouter.push).toHaveBeenCalledWith("/home");
  });

  it("should not redirect if the logout request is unsuccessful", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ status: 500 });

    await logout(mockAuth, mockRouter, mockOnError, true, "/login");

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("should call the onError callback if an error occurs during post call", async () => {
    const error = new Error("Test error");
    (axios.post as jest.Mock).mockRejectedValue(error);

    await logout(mockAuth, mockRouter, mockOnError, true, "/login");

    expect(mockOnError).toHaveBeenCalledWith(error);
  });

  it("should call the onError callback if an error occurs during sign out", async () => {
    const error = new Error("Test error");
    mockAuth.signOut.mockRejectedValue(error);

    await logout(mockAuth, mockRouter, mockOnError, true, "/login");

    expect(mockOnError).toHaveBeenCalledWith(error);
  });
});
