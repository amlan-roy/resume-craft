"use client";

import { useEffect, useState } from "react";
import { fetchAndActivate } from "firebase/remote-config";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";
import { mailToLinks } from "@/lib/utils/string-helpers";
import BoxLoader from "@/components/loading/BoxLoader";
import { ThemeProvider } from "@/components/providers/components/theme-provider";
import { UserDataStoreProvider } from "@/components/providers/user-data-store-provider";

/**
 * A wrapper component that wraps the entire application and is used to do any operations that need to be done at the app load and require a client side component.
 */
const RootWrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | any>();
  const isError = !!error;

  const [remoteConfig, , , remoteConfigPromise] = useRemoteConfig();

  const loadApp: () => Promise<any> = async () => {
    await remoteConfigPromise;
    const fetchAndActivatePromise =
      remoteConfig && fetchAndActivate(remoteConfig);
    return Promise.all([fetchAndActivatePromise]);
  };

  useEffect(() => {
    loadApp()
      .then(() => {
        setIsLoading(false);
        setError(undefined);
      })
      .catch((err) => {
        const errorMessage =
          err.message || "An error occurred while loading the app";
        console.error(new Error(errorMessage));
        setIsLoading(false);
        setError(err);
      });

    return () => {};
  }, [remoteConfig, remoteConfigPromise]);

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <UserDataStoreProvider>
        {isLoading ? (
          <div className="flex-grow flex w-full h-full justify-center items-center mt-9">
            <BoxLoader className="w-20 h-20 mx-auto my-auto" />
          </div>
        ) : isError ? (
          <div className="flex-grow flex w-full h-full justify-center items-center mt-9">
            <span>
              <h1 className="text-red-700 text-lg">
                An error occurred while loading the app. Please try again later.
              </h1>
              <p className="text-gray-400 text-sm">
                If the issue persists, please contact{" "}
                <a
                  className="text-blue-500"
                  href={mailToLinks({
                    subject: "Error in loading the app",
                    content:
                      "An error occurred while loading the app. Please check and resolve the issue.\n\n Error: " +
                      error,
                  })}
                >
                  support
                </a>
                !
              </p>
            </span>
          </div>
        ) : (
          children
        )}
      </UserDataStoreProvider>
    </ThemeProvider>
  );
};

export default RootWrapper;
