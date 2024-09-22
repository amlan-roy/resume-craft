import { act, renderHook } from "@testing-library/react";
import * as firebaseAuth from "firebase/auth";
import { fetchAndActivate, getRemoteConfig } from "firebase/remote-config";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";
import { expectError } from "@/lib/utils/test-helpers/console-mocks";
import { remoteConfigMock } from "@/lib/utils/test-helpers/hooks/remoteConfigHelpers";

jest.mock("firebase/remote-config");
jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  signInWithEmailAndPassword: jest.fn(),
  getIdToken: jest.fn(),
  EmailAuthProvider: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  getAuth: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

describe("useRemoteConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getRemoteConfig as jest.Mock).mockReturnValue(remoteConfigMock);
  });

  it("should fetch and activate remote config on mount when fetchAndActivate succeds", async () => {
    let resolveFetchAndActivate: any;
    (fetchAndActivate as jest.Mock).mockResolvedValue(
      new Promise((resolve) => (resolveFetchAndActivate = resolve))
    );

    const { result } = renderHook(() => useRemoteConfig());
    expect(result.current[0]).toBe(null);
    expect(result.current[1]).toBeInstanceOf(Function);
    expect(result.current[2]).toBeInstanceOf(Function);
    expect(result.current[3]).toBeTruthy();
    expect(fetchAndActivate).toHaveBeenCalled();
    await act(async () => {
      resolveFetchAndActivate(true);
    });

    expect(result.current[0]).toBe(remoteConfigMock);
  });

  it("should fetch and activate remote config on mount when fetchAndActivate fails", async () => {
    expectError("Error fetching remote config:");
    let rejectFetchAndActivate: any;
    (fetchAndActivate as jest.Mock).mockResolvedValue(
      new Promise((resolve, reject) => (rejectFetchAndActivate = reject))
    );

    const { result } = renderHook(() => useRemoteConfig());
    expect(result.current[0]).toBe(null);
    expect(result.current[1]).toBeInstanceOf(Function);
    expect(result.current[2]).toBeInstanceOf(Function);
    expect(result.current[3]).toBeTruthy();
    expect(fetchAndActivate).toHaveBeenCalled();
    await act(async () => {
      rejectFetchAndActivate("custom-error-message");
    });

    expect(result.current[0]).toBe(null);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching remote config:",
      "custom-error-message"
    );
  });
});
