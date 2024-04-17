"use client";

import React, { useCallback, useEffect } from "react";

type ModalStateProviderProps = {
  children: React.ReactNode;
};

type ModalState = {
  title?: string;
  message?: string;
  isOpen: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ModalStateContextType = {
  modalState: ModalState;
  setModalState: (newState: ModalState) => void;
};

export const ModalStateContext = React.createContext<ModalStateContextType>({
  modalState: {
    isOpen: false,
  },
  setModalState: () => console.warn("No modal state provider"),
});

const ModalStateProvider: React.FC<ModalStateProviderProps> = ({
  children,
}) => {
  const [modalState, setModalState] = React.useState<ModalState>({
    isOpen: false,
  });

  const setModalStateHandler = useCallback((newState: ModalState) => {
    setModalState(() => newState);
  }, []);

  const modalStateContextValue = React.useMemo(() => {
    return {
      modalState,
      setModalState: setModalStateHandler,
    };
  }, [modalState, setModalStateHandler]);

  return (
    <ModalStateContext.Provider value={modalStateContextValue}>
      {children}
    </ModalStateContext.Provider>
  );
};

export default ModalStateProvider;
