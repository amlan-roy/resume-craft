"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";

/**
 * A custom hook that returns the value of the data stored in local storage with the provided key
 *
 * If no initial value is provided, then the entry for the key will not be made when the hook if first called.
 * In such case, the entry can be made by the setValue method returned.
 *
 * @param key: The key used to retrieve the record from the local storage
 * @param initialValue: The initial value to set if existing record is not found in the local storage
 * @returns [value, setValue]: The value and the set value for the local storage record
 */
const useLocalStorage = (key: string, initialValue?: string) => {
  const [value, setValue] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      return item || initialValue;
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (value !== undefined) window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue] as [
    string | undefined,
    Dispatch<SetStateAction<string | undefined>>,
  ];
};

export default useLocalStorage;
