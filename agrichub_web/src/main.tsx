import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import AppProvider from "./providers/AppProvider";
import { router } from "./routes/AppRouter";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
    </AppProvider>
  </StrictMode>
);