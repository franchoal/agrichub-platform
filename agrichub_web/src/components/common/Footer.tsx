import {
ArrowUpRight,
Mail,
MapPin,
Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";

import logoIcon from "../../assets/logo/logo-icon.png";

const exploreLinks = [
{
label: "Marketplace",
to: "/products",
},
{
label: "Community",
to: "/",
},
{
label: "Training & Learning",
to: "/register",
},
];

const audienceLinks = [
{
label: "Farmers",
to: "/farmer",
},
{
label: "Buyers",
to: "/register",
},
{
label: "Agribusinesses",
to: "/register",
},
{
label: "Agricultural Professionals",
to: "/register",
},
];

const agricWiseLinks = [
{
label: "About AgricWise",
to: "/about",
},
{
label: "How It Works",
to: "/register",
},
{
label: "Sign In",
to: "/login",
},
{
label: "Create Account",
to: "/register",
},
];

function Footer() {
return ( <footer className="relative overflow-hidden bg-[#071F14] text-white">
{/* Ambient background */} <div className="pointer-events-none absolute -left-40 -top-40 h-72 w-72 rounded-full bg-green-600/10 blur-3xl sm:h-96 sm:w-96" />

```
  <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-lime-500/5 blur-3xl sm:h-[30rem] sm:w-[30rem]" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
    {/* Brand statement */}
    <div className="border-b border-white/10 py-10 sm:py-14 lg:py-20">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-2 shadow-lg sm:h-12 sm:w-12 sm:rounded-2xl">
              <img
                src={logoIcon}
                alt="AgricWise"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black tracking-tight">
                AgricWise Africa
              </p>

              <p className="text-[11px] text-green-300/60 sm:text-xs">
                Connect. Trade. Grow.
              </p>
            </div>
          </div>

          {/* Statement */}
          <h2 className="mt-6 text-[2rem] font-black leading-[1.08] tracking-tight sm:mt-7 sm:text-4xl lg:text-5xl">
            Agriculture.
            <span className="text-green-400">
              {" "}
              Connected.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/55 sm:mt-5 sm:text-base sm:leading-8">
            AgricWise brings farmers, buyers, businesses, knowledge
            and opportunities closer together through one growing
            digital agricultural ecosystem.
          </p>
        </div>

        {/* CTA */}
        <Link
          to="/register"
          className="group inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-full bg-green-500 px-6 py-3.5 text-sm font-bold text-green-950 shadow-lg shadow-green-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-green-400 sm:w-fit"
        >
          Join AgricWise

          <ArrowUpRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </div>

    {/* Navigation */}
    <div className="grid gap-9 border-b border-white/10 py-10 sm:grid-cols-2 sm:gap-12 sm:py-14 lg:grid-cols-4 lg:gap-10 lg:py-16">
      {/* Explore */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-300 sm:text-xs">
          Explore
        </h3>

        <nav className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          {exploreLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="group flex w-fit items-center gap-1.5 text-sm text-white/55 transition hover:text-white"
            >
              <span>{link.label}</span>

              <ArrowUpRight
                size={13}
                className="opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </Link>
          ))}
        </nav>
      </div>

      {/* For You */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-300 sm:text-xs">
          For You
        </h3>

        <nav className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          {audienceLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="group flex w-fit items-center gap-1.5 text-sm text-white/55 transition hover:text-white"
            >
              <span>{link.label}</span>

              <ArrowUpRight
                size={13}
                className="opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </Link>
          ))}
        </nav>
      </div>

      {/* AgricWise */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-300 sm:text-xs">
          AgricWise
        </h3>

        <nav className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          {agricWiseLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="group flex w-fit items-center gap-1.5 text-sm text-white/55 transition hover:text-white"
            >
              <span>{link.label}</span>

              <ArrowUpRight
                size={13}
                className="opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </Link>
          ))}
        </nav>
      </div>

      {/* Connect */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-300 sm:text-xs">
          Connect
        </h3>

        <div className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
          <div className="flex items-start gap-3 text-sm text-white/55">
            <Mail
              size={17}
              className="mt-0.5 shrink-0 text-green-400"
            />

            <span>
              Get in touch with the AgricWise team.
            </span>
          </div>

          <div className="flex items-start gap-3 text-sm text-white/55">
            <MapPin
              size={17}
              className="mt-0.5 shrink-0 text-green-400"
            />

            <span>Nigeria</span>
          </div>
        </div>

        {/* Social */}
        <div className="mt-5 flex items-center gap-2 sm:mt-6">
          <button
            type="button"
            aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-black text-white/50 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
          >
            f
          </button>

          <button
            type="button"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-black tracking-tight text-white/50 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
          >
            IG
          </button>

          <button
            type="button"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-black text-white/50 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
          >
            in
          </button>
        </div>
      </div>
    </div>

    {/* Value strip */}
    <div className="flex flex-col gap-4 border-b border-white/10 py-6 sm:gap-5 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-2.5 sm:items-center">
        <Sprout
          size={18}
          className="mt-0.5 shrink-0 text-green-400 sm:mt-0"
        />

        <p className="text-xs font-semibold leading-5 text-white/45 sm:text-sm sm:leading-6">
          Built for the people who make agriculture happen.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-semibold text-white/35 sm:gap-x-4 sm:text-[11px]">
        <span>Buy</span>
        <span aria-hidden="true">•</span>
        <span>Sell</span>
        <span aria-hidden="true">•</span>
        <span>Learn</span>
        <span aria-hidden="true">•</span>
        <span>Connect</span>
        <span aria-hidden="true">•</span>
        <span>Grow</span>
      </div>
    </div>

    {/* Legal / copyright */}
    <div className="flex flex-col gap-4 py-6 text-[10px] text-white/30 sm:gap-5 sm:py-7 sm:text-[11px] lg:flex-row lg:items-center lg:justify-between">
      <p>
        © {new Date().getFullYear()} AgricWise Africa. All rights
        reserved.
      </p>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <button
          type="button"
          className="transition hover:text-white/60"
        >
          Privacy Policy
        </button>

        <button
          type="button"
          className="transition hover:text-white/60"
        >
          Terms of Service
        </button>

        <button
          type="button"
          className="transition hover:text-white/60"
        >
          Cookie Policy
        </button>
      </div>
    </div>
  </div>
</footer>


);
}

export default Footer;
