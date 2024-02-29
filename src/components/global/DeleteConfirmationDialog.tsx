import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import React from "react";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";

type DeleteConfirmationDialogProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  description?: string;
  open?: boolean;
  title?: string;
} & AlertDialogProps;

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Continue",
  description = "This action cannot be undone. This will permanently the data that you have entered for this section.",
  title = "Do you want to delete this section?",
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
export default DeleteConfirmationDialog;
