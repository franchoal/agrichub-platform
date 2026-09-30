import {
ArrowRight,
LogIn,
Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";

import logoIcon from "../../../assets/logo/logo-icon.png";

function FinalCTASection() {
return ( <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
{/* Ambient background */} <div className="pointer-events-none absolute -left-40 top-10 h-72 w-72 rounded-full bg-green-100/70 blur-3xl sm:h-80 sm:w-80" />

```
  <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-lime-100/60 blur-3xl sm:h-96 sm:w-96" />

  <div className="relative mx-auto max-w-6xl">
    <div className="relative overflow-hidden rounded-[28px] border border-green-100 bg-[#F3F9EF] shadow-[0_25px_80px_-40px_rgba(22,101,52,0.35)] sm:rounded-[32px] lg:rounded-[36px]">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-200/40 blur-2xl sm:h-64 sm:w-64" />

      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-lime-200/30 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative px-5 py-10 text-center sm:px-10 sm:py-14 lg:px-16 lg:py-20">
        {/* Logo */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-white p-2.5 shadow-md ring-1 ring-green-100 sm:h-16 sm:w-16 sm:rounded-[22px] sm:p-3">
          <img
            src={logoIcon}
            alt="AgricWise"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Badge */}
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700 backdrop-blur-sm sm:mt-6 sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
          <Sprout size={13} />
          Join the ecosystem
        </div>

        {/* Heading */}
        <h2 className="mx-auto mt-5 max-w-3xl text-[2rem] font-black leading-[1.08] tracking-tight text-gray-900 sm:mt-6 sm:text-4xl lg:text-5xl">
          Ready to grow with{" "}
          <span className="text-green-600">
            AgricWise?
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-base sm:leading-8">
          Join a growing digital agricultural ecosystem built to
          connect people, products, knowledge and opportunities
          across the agricultural value chain.
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
          <Link
            to="/register"
            className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 sm:w-auto sm:px-7"
          >
            Create Free Account

            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/login"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-green-200 bg-white px-6 py-3.5 text-sm font-bold text-green-800 transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-50 sm:w-auto sm:px-7"
          >
            <LogIn size={17} />
            Sign In
          </Link>
        </div>

        {/* Value pills */}
        <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-1.5 sm:mt-10 sm:gap-2">
          {["Buy", "Sell", "Learn", "Connect", "Grow"].map(
            (item) => (
              <span
                key={item}
                className="rounded-full border border-green-100 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold text-green-700 shadow-sm sm:px-4 sm:py-2 sm:text-[11px]"
              >
                {item}
              </span>
            )
          )}
        </div>

        {/* Closing statement */}
        <div className="mx-auto mt-8 max-w-xl border-t border-green-200/70 pt-6 sm:mt-10 sm:pt-7">
          <p className="text-[11px] font-semibold leading-5 text-gray-500 sm:text-sm sm:leading-6">
            Built for agriculture.
            <span className="mx-1.5 text-green-500">
              •
            </span>
            Designed for connection.
            <span className="mx-1.5 text-green-500">
              •
            </span>
            Growing with you.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


);
}

export default FinalCTASection;
