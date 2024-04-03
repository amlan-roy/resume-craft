import { useRouter } from "next/navigation";
import axios from "axios";
import { Auth } from "firebase/auth";

/**
 * Logs out the user, removes the session token and redirects to the login page.
 * @param auth - The Firebase Auth object.
 * @param router - The router object from Next.js.
 * @param onError - Optional callback function to handle errors.
 * @param shouldRedirect - Determines whether to redirect to the login page after logging out.
 * @param redirectPath - The path to redirect to after logging out.
 * NOTE: Do not give the path of a protected route as the redirect path. It may cause an infinite loop.
 *
 * @throws Error - If an error occurs while logging out.
 */
export const logout = async (
  auth: Auth,
  router: ReturnType<typeof useRouter>,
  onError?: Function,
  shouldRedirect = true,
  redirectPath = "/login"
) => {
  try {
    auth.currentUser && (await auth.signOut());
    const response = await axios.post("/api/logout");

    if (shouldRedirect && response.status === 200) {
      router.push(redirectPath);
      return;
    }
  } catch (e: Error | any) {
    console.error(e);
    onError?.(e);
  }
};
