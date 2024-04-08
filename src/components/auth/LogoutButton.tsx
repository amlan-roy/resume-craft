import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/services/auth/logout";
import { auth } from "@/lib/utils/firebase/config";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type LogoutButtonProps = {
  buttonClass?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * LogoutButton component.
 * @component
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  buttonClass,
  ...rest
}) => {
  const router = useRouter();
  const { toast: displayToast } = useToast();

  return (
    <div className="flex items-center space-x-2 mx-2 mt-4" {...rest}>
      <Button
        variant={"outline"}
        onClick={() =>
          logout(auth, router, (e: Error | any) => {
            const description = e?.message || "Please try again.";
            displayToast({
              title: "An error has occurred while logging out!",
              description,
              variant: "destructive",
            });
          })
        }
        className={buttonClass}
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
