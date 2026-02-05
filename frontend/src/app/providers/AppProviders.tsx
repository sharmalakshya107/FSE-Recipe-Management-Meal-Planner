import React from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { GlobalErrorBoundary } from "../error-boundary/GlobalErrorBoundary";
import { ToastProvider } from "../../components/feedback/Toast";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <GlobalErrorBoundary>
      <Provider store={store}>
        <ToastProvider>{children}</ToastProvider>
      </Provider>
    </GlobalErrorBoundary>
  );
};
