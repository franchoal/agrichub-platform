import type { ReactNode } from "react";

import logoIcon from "../assets/logo/logo-icon.png";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({
  children,
}: AuthLayoutProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8FCF5] via-white to-[#EEF8E9]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-10">

        {/* AGRICWISE BRANDING */}

        <div className="mb-8 text-center">
          <img
            src={logoIcon}
            alt="AgricWise"
            className="mx-auto h-20 w-20 object-contain"
          />

          <h1 className="mt-3 text-2xl font-black tracking-tight text-green-800">
            AgricWise
          </h1>

          <p className="mt-1 text-sm font-medium text-gray-500">
            Connecting Agriculture. Empowering Communities.
          </p>
        </div>

        {children}

      </div>
    </main>
  );
};

export default AuthLayout;