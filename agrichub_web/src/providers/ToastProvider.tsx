
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 16,
        left: 16,
        right: 16,
        pointerEvents: "none",
      }}
      toastOptions={{
        duration: 2000,
        style: {
          pointerEvents: "none",
          maxWidth: "min(420px, calc(100vw - 32px))",
        },
      }}
    />
  );
}
