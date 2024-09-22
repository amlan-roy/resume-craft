import { useEffect, useState } from "react";
import {
  RemoteConfig,
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from "firebase/remote-config";
import { app } from "@/lib/utils/firebase/config";
import { EXPERIMENTS } from "@/lib/utils/firebase/constants/experiments";

/**
 * A hook that fetches and activates the remote config and returns the remote config object.
 * This hook should only be used in client side components.
 *
 * Note: We have created this hook instead of adding the remote config firebase/config.js because we're
 * facing an error with ssr and remote config. We're seeing an error that says "window is not defined"
 * even when using the remoteConfig object only in client side components. We're still investigating
 * the issue and will update the code once we have a solution.
 *
 * @returns The remote config object.
 */

function useRemoteConfig() {
  const [remoteConfig, setRemoteConfig] = useState<null | RemoteConfig>(null);
  const [remoteConfigPromise, setRemoteConfigPromise] =
    useState<Promise<void> | null>(null);

  useEffect(() => {
    try {
      const remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 3000;
      remoteConfig.defaultConfig = EXPERIMENTS;

      const promise = fetchAndActivate(remoteConfig)
        .then(() => {
          setRemoteConfig(remoteConfig);
        })
        .catch((error) => {
          console.error("Error fetching remote config:", error);
        });
      setRemoteConfigPromise(promise);
    } catch (error) {
      console.error("Error fetching remote config:", error);
    }
  }, []);

  const getExperimentValue = (experimentName: string): string => {
    return remoteConfig
      ? getValue(remoteConfig, experimentName).asString()
      : "";
  };

  const isExperimentEnabled = (experimentName: string): boolean => {
    return (
      !!remoteConfig &&
      !["control", ""].includes(getExperimentValue(experimentName))
    );
  };

  return [
    remoteConfig,
    isExperimentEnabled,
    getExperimentValue,
    remoteConfigPromise,
  ] as [
    typeof remoteConfig,
    typeof isExperimentEnabled,
    typeof getExperimentValue,
    typeof remoteConfigPromise,
  ];
}

export default useRemoteConfig;
