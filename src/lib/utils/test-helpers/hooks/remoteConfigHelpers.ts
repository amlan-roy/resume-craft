import { FirebaseApp } from "firebase/app";
import { RemoteConfig } from "firebase/remote-config";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";

export const appMock: FirebaseApp = {
  name: "test",
  options: {
    apiKey: "test",
    authDomain: "test",
    projectId: "test",
    storageBucket: "test",
    messagingSenderId: "test",
    appId: "test",
    measurementId: "test",
  },
  automaticDataCollectionEnabled: true,
};

export const defaultConfigMock = { someKey: "someValue" };

export const remoteConfigMock: RemoteConfig = {
  app: appMock,
  settings: {
    minimumFetchIntervalMillis: 3000,
    fetchTimeoutMillis: 3000,
  },
  defaultConfig: defaultConfigMock,
  fetchTimeMillis: 3000,
  lastFetchStatus: "no-fetch-yet",
};

export const setupExperimentTesting = () => {
  jest.mock("@/lib/hooks/useRemoteConfig");
};

export const setExperiment = (experiments: { [key: string]: any }) => {
  (useRemoteConfig as jest.Mock).mockReturnValue([
    { ...remoteConfigMock, defaultConfig: experiments },
    jest.fn().mockImplementation((experimentName: string) => {
      return !["control", ""].includes(experiments[experimentName]);
    }),
    jest.fn().mockImplementation((experimentName: string) => {
      return experiments[experimentName] || "";
    }),
    Promise.resolve(),
  ]);
};
