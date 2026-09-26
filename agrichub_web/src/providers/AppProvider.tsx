import type { ReactNode } from "react";

import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
import AuthProvider from "./AuthProvider";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({
  children,
}: AppProviderProps) => {
  return (
    <QueryProvider>
      <ToastProvider />

      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
};

export default AppProvider;