import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logoIcon from "../../../assets/logo/logo-icon.png";

function HeroSection() {
  const navigate = useNavigate();

  const handleExplore = () => {
    document
      .getElementById("about-agricwise")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section className="relative flex min-h-[760px] overflow-hidden bg-green-950 text-white sm:min-h-[820px] lg:min-h-[100svh]">
      {/* Hero video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source
          src="/video/Hero_video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overall contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Left-side text protection */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />

      {/* Mobile bottom protection */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />

      {/* Content */}
      <div className="relative z-10 flex w-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            {/* Brand */}
            <div className="mb-6 flex items-center gap-3 sm:mb-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-lg backdrop-blur sm:h-12 sm:w-12">
                <img
                  src={logoIcon}
                  alt="AgricWise"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-200 sm:text-sm sm:tracking-[0.22em]">
                  AgricWise Africa
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-white/70 sm:text-xs">
                  Smart Agricultural Ecosystem
                </p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="max-w-xl text-[2.7rem] font-black leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:max-w-3xl lg:text-7xl">
              Connect.
              <br />

              <span className="text-green-300">
                Trade.
              </span>

              <br />

              Grow.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/90 sm:mt-7 sm:text-lg sm:leading-8">
              Everything you need to grow, trade and succeed in
              agriculture — connecting farmers, buyers, businesses
              and opportunities in one growing ecosystem.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-950/30 transition duration-200 hover:bg-green-500 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-green-950 sm:w-auto sm:px-7"
              >
                Get Started

                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={handleExplore}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-auto sm:px-7"
              >
                <Play
                  size={16}
                  fill="currentColor"
                />

                Explore AgricWise
              </button>
            </div>

            {/* Platform positioning */}
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold text-white/70 sm:mt-10 sm:gap-x-5 sm:text-xs">
              <span>Buy</span>

              <span className="text-green-300">•</span>

              <span>Sell</span>

              <span className="text-green-300">•</span>

              <span>Learn</span>

              <span className="text-green-300">•</span>

              <span>Connect</span>

              <span className="text-green-300">•</span>

              <span>Grow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop scroll indicator */}
      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
          Explore
        </span>

        <div className="h-10 w-px overflow-hidden bg-white/20">
          <div className="h-1/2 w-full animate-pulse bg-green-300" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;