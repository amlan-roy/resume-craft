import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/lib/utils/firebase/config";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type LogoutButtonProps = {};

/**
 * Logs out the user, removes the session token and redirects to the login page.
 * @param router - The router object from Next.js.
 * @param onError - Optional callback function to handle errors.
 * @param avoidRedirect - Optional flag to avoid redirecting to the login page after logout.
 * @throws Error - If an error occurs while logging out.
 */
export const logout = async (
  router: ReturnType<typeof useRouter>,
  onError?: Function,
  avoidRedirect?: boolean
) => {
  try {
    auth.currentUser && (await auth.signOut());
    const response = await axios.post("/api/logout");

    if (!avoidRedirect && response.status === 200) {
      router.push("/login");
      return;
    }
  } catch (e: Error | any) {
    console.error(e);
    onError?.(e);
  }
};

/**
 * LogoutButton component.
 * @component
 */
const LogoutButton: React.FC<LogoutButtonProps> = () => {
  const router = useRouter();
  const { toast: displayToast } = useToast();

  return (
    <div className="flex items-center space-x-2 mx-2 mt-4">
      <Button
        variant={"outline"}
        onClick={() =>
          logout(router, (e: Error | any) => {
            const description = e?.message || "Please try again.";
            displayToast({
              title: "An error has occurred while logging out!",
              description,
              variant: "destructive",
            });
          })
        }
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
