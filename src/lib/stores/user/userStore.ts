import { create } from "zustand";
import { auth } from "@/lib/utils/firebase/config";

type UserBasicData = {
  name?: string;
  email: string;
  emailVerified?: boolean;
  uid: string;
};

type UserDataStoreState = {
  userData?: UserBasicData;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
};

type UserDataStoreActions = {
  setIsEmailVerified: (value: boolean) => void;
  verifyAndSetEmailVerified: (emailAlreadyVerified?: boolean) => Promise<void>;
  setIsAuthenticated: (value: boolean) => void;
  setUserData: (data: UserBasicData) => void;
  fetchAndSetUserData: () => Promise<void>;
};

type UserDataStore = UserDataStoreState & UserDataStoreActions;

const defaultUserStoreData: UserDataStoreState = {
  isAuthenticated: false,
  isEmailVerified: false,
  userData: undefined,
};

const initUserDataStore = async (): Promise<UserDataStoreState> => {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (user) {
    return {
      userData: {
        email: user.email || "",
        emailVerified: user.emailVerified,
        uid: user.uid,
      },
      isEmailVerified: user.emailVerified,
      isAuthenticated: true,
    };
  } else {
    return defaultUserStoreData;
  }
};

const createUserDataStore = (
  initState: UserDataStoreState = defaultUserStoreData
) => {
  return create<UserDataStore>((set) => ({
    ...initState,
    setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
    setIsEmailVerified: (value: boolean) => set({ isEmailVerified: value }),
    setUserData: (data: UserBasicData) => set({ userData: data }),
    fetchAndSetUserData: async () => {
      const data = await initUserDataStore();
      set(data);
    },
    verifyAndSetEmailVerified: async (emailAlreadyVerified?: boolean) => {
      if (emailAlreadyVerified) {
        return;
      }
      await auth.authStateReady();
      const user = auth.currentUser;
      if (user) {
        set({ isEmailVerified: user.emailVerified });
      } else {
        set({ isEmailVerified: false });
      }
    },
    resetData: () => set({ ...defaultUserStoreData }),
  }));
};

export { initUserDataStore, createUserDataStore, defaultUserStoreData };
export type { UserDataStore };
