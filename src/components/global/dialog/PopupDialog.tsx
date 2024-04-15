import React from "react";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PopupDialogProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  description: string;
  open?: boolean;
  title: string;
} & AlertDialogProps;

const PopupDialog: React.FC<PopupDialogProps> = ({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Continue",
  description,
  title,
  open,
  ...rest
}) => {
  return (
    <AlertDialog open={open} {...rest}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel?.();
            }}
            type="button"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
            }}
            type="button"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default PopupDialog;
