import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { getAuth } from "firebase/auth";
import { fetchAndActivate } from "firebase/remote-config";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";
import { expectError } from "@/lib/utils/test-helpers/console-mocks";
import {
  getMockAuth,
  getMockUser,
} from "@/lib/utils/test-helpers/hooks/authentication/authHelpers";
import RootWrapper from "@/components/global/wrappers/root/RootWrapper";

jest.mock("@/lib/hooks/useRemoteConfig");
jest.mock("firebase/remote-config");
jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  GoogleAuthProvider: jest.fn(),
  getAuth: jest.fn(),
}));

// this is to overcome the error "TypeError: window.matchMedia is not a function"
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("RootWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockAuth = getMockAuth({
      currentUser: getMockUser(),
      authStateReady: () => Promise.resolve(true),
    });

    jest.mock("@/lib/utils/firebase/config", () => ({
      auth: mockAuth,
    }));

    (getAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  it.skip("should render children when remote config is loaded", async () => {
    (useRemoteConfig as jest.Mock).mockReturnValue([
      { someKey: "someValue" },
      jest.fn(),
      jest.fn(),
      Promise.resolve(),
    ]);
    (fetchAndActivate as jest.Mock).mockResolvedValue(true);

    const { getByText } = render(
      <RootWrapper>
        <div>Child Component</div>
      </RootWrapper>
    );

    await waitFor(() => {
      expect(getByText("Child Component")).toBeInTheDocument();
    });
  });

  it.skip("should handle remote config load failure", async () => {
    (useRemoteConfig as jest.Mock).mockReturnValue([
      null,
      jest.fn(),
      jest.fn(),
      Promise.reject(new Error("Failed to load remote config")),
    ]);

    expectError("Failed to load remote config");

    const { queryByText } = render(
      <RootWrapper>
        <div>Child Component</div>
      </RootWrapper>
    );

    await waitFor(() => {
      expect(queryByText("Child Component")).not.toBeInTheDocument();
      expect(
        queryByText(
          "An error occurred while loading the app. Please try again later."
        )
      ).toBeInTheDocument();
    });
  });

  it.skip("should handle remote config fetchAndActivate failure", async () => {
    (useRemoteConfig as jest.Mock).mockReturnValue([
      { someKey: "someValue" },
      jest.fn(),
      jest.fn(),
      Promise.resolve(),
    ]);
    (fetchAndActivate as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch and activate remote config")
    );

    expectError("Failed to fetch and activate remote config");

    const { queryByText } = render(
      <RootWrapper>
        <div>Child Component</div>
      </RootWrapper>
    );

    await waitFor(() => {
      expect(queryByText("Child Component")).not.toBeInTheDocument();
      expect(
        queryByText(
          "An error occurred while loading the app. Please try again later."
        )
      ).toBeInTheDocument();
    });
  });

  it.skip("should render loading spinner when remote config is loading", async () => {
    (useRemoteConfig as jest.Mock).mockReturnValue([
      null,
      jest.fn(),
      jest.fn(),
      Promise.resolve(),
    ]);

    const { getByTestId } = render(
      <RootWrapper>
        <div>Child Component</div>
      </RootWrapper>
    );

    await waitFor(() => {
      expect(getByTestId("box-loader")).toBeInTheDocument();
    });
  });
});
