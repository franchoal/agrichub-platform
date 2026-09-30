import {
ArrowRight,
BriefcaseBusiness,
GraduationCap,
ShoppingBasket,
Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";

const audienceCards = [
{
icon: Sprout,
title: "Farmers",
description:
"Showcase your products, reach buyers and discover useful opportunities for your farm or agribusiness.",
},
{
icon: ShoppingBasket,
title: "Buyers",
description:
"Discover agricultural products and connect with farmers, sellers and businesses across the value chain.",
},
{
icon: BriefcaseBusiness,
title: "Agribusinesses",
description:
"Build visibility, reach customers and create meaningful connections around your agricultural business.",
},
{
icon: GraduationCap,
title: "Professionals & Learners",
description:
"Explore agricultural knowledge, practical insights, learning opportunities and useful industry connections.",
},
];

function AboutAgricWiseSection() {
return ( <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
{/* Background atmosphere */} <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-green-100/60 blur-3xl sm:h-80 sm:w-80" />

```
  <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-lime-100/50 blur-3xl sm:h-96 sm:w-96" />

  <div className="relative mx-auto max-w-7xl">
    {/* Introduction */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700 sm:px-4 sm:text-xs sm:tracking-[0.18em]">
        <Sprout size={14} />
        What is AgricWise?
      </div>

      <h2 className="mt-4 text-[2rem] font-black leading-[1.08] tracking-tight text-gray-900 sm:mt-5 sm:text-4xl lg:text-5xl">
        A digital space for{" "}
        <span className="text-green-600">
          agriculture.
        </span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-lg sm:leading-8">
        AgricWise brings together the people, products and
        opportunities that make agriculture work — giving farmers,
        buyers, businesses and professionals a place to discover,
        connect and grow.
      </p>
    </div>

    {/* Main product card */}
    <div className="mt-9 overflow-hidden rounded-[26px] border border-green-100 bg-[#F5FAF2] shadow-[0_24px_70px_-40px_rgba(22,101,52,0.35)] sm:mt-12 sm:rounded-[32px]">
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        {/* Identity panel */}
        <div className="relative overflow-hidden bg-green-800 px-5 py-7 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-green-500/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-green-950/50 blur-3xl" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 sm:h-12 sm:w-12">
              <Sprout size={23} />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-green-200 sm:mt-7 sm:text-[11px]">
              AgricWise Africa
            </p>

            <h3 className="mt-2.5 text-[1.8rem] font-black leading-tight sm:text-4xl">
              Agriculture,
              <span className="block text-green-200">
                brought closer.
              </span>
            </h3>

            <p className="mt-4 max-w-md text-sm leading-6 text-green-50/90 sm:mt-5 sm:text-base sm:leading-7">
              A growing platform where people connected to
              agriculture can discover products, exchange knowledge,
              find opportunities and build useful connections.
            </p>

            <div className="mt-7 sm:mt-8">
              <Link
                to="/register"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-green-800 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-green-50 sm:px-6 sm:py-3.5"
              >
                Get started

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Audience cards */}
        <div className="grid gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:p-8">
          {audienceCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="group rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-[24px] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 transition duration-300 group-hover:bg-green-600 group-hover:text-white sm:h-11 sm:w-11 sm:rounded-2xl">
                    <Icon size={20} />
                  </div>

                  <ArrowRight
                    size={16}
                    className="mt-1 text-green-200 transition duration-200 group-hover:translate-x-1 group-hover:text-green-500"
                  />
                </div>

                <h4 className="mt-4 text-base font-extrabold text-gray-900 sm:mt-5">
                  {card.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>

    {/* Compact audience line */}
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-center text-[11px] font-semibold text-gray-400 sm:mt-8 sm:gap-x-3 sm:text-sm">
      <span className="text-green-600">Farmers</span>

      <span aria-hidden="true">•</span>

      <span>Buyers</span>

      <span aria-hidden="true">•</span>

      <span>Agribusinesses</span>

      <span aria-hidden="true">•</span>

      <span>Professionals</span>

      <span aria-hidden="true">•</span>

      <span>Learners</span>
    </div>
  </div>
</section>

);
}

export default AboutAgricWiseSection;
