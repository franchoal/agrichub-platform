import {
ArrowRight,
BellRing,
BriefcaseBusiness,
Coins,
GraduationCap,
MessageCircle,
ShoppingBag,
Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";

type Capability = {
icon: typeof ShoppingBag;
title: string;
description: string;
status: "available" | "growing";
action?: string;
to?: string;
};

const capabilities: Capability[] = [
{
icon: ShoppingBag,
title: "Buy & Sell",
description:
"Discover agricultural products, explore listings and connect with farmers and sellers across the marketplace.",
status: "available",
action: "Explore Marketplace",
to: "/products",
},
{
icon: MessageCircle,
title: "Connect & Discuss",
description:
"Join agricultural conversations, share experiences, ask questions and exchange useful knowledge with others.",
status: "available",
action: "Join the Community",
to: "/register",
},
{
icon: Sprout,
title: "Learn & Grow",
description:
"Discover practical agricultural knowledge, insights and learning opportunities designed to support your journey.",
status: "growing",
},
{
icon: BriefcaseBusiness,
title: "Discover Opportunities",
description:
"Find useful opportunities across agriculture as AgricWise continues to bring more parts of the value chain together.",
status: "growing",
},
{
icon: BellRing,
title: "Stay Informed",
description:
"Keep up with timely agricultural information, useful tips and updates that can help you make informed decisions.",
status: "growing",
},
{
icon: GraduationCap,
title: "Build Your Knowledge",
description:
"Access resources and future learning experiences for farmers, entrepreneurs, professionals and anyone interested in agriculture.",
status: "growing",
},
];

function ServicesSection() {
return ( <section className="relative overflow-hidden bg-[#F6FAF3] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
{/* Background atmosphere */} <div className="pointer-events-none absolute -right-40 -top-40 h-72 w-72 rounded-full bg-green-200/30 blur-3xl sm:h-96 sm:w-96" />

```
  <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-lime-100/60 blur-3xl sm:h-96 sm:w-96" />

  <div className="relative mx-auto max-w-7xl">
    {/* Introduction */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-100 bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700 shadow-sm sm:px-4 sm:text-xs sm:tracking-[0.18em]">
        <Sprout size={14} />
        What you can do
      </div>

      <h2 className="mt-4 text-[2rem] font-black leading-[1.08] tracking-tight text-gray-900 sm:mt-5 sm:text-4xl lg:text-5xl">
        Everything starts with a{" "}
        <span className="text-green-600">
          connection.
        </span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-lg sm:leading-8">
        Whether you are looking for products, sharing knowledge or
        exploring new opportunities, AgricWise is designed to make
        it easier to take the next step.
      </p>
    </div>

    {/* Capability cards */}
    <div className="mt-9 grid gap-3 sm:mt-11 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {capabilities.map((capability) => {
        const Icon = capability.icon;
        const isAvailable = capability.status === "available";

        return (
          <article
            key={capability.title}
            className="group relative flex min-h-[255px] flex-col overflow-hidden rounded-[24px] border border-green-100/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-[275px] sm:rounded-[28px] sm:p-7"
          >
            {/* Status */}
            <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-green-700 sm:px-3 sm:text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Available
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 sm:px-3 sm:text-[10px]">
                  Growing
                </span>
              )}
            </div>

            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 transition duration-300 group-hover:bg-green-700 group-hover:text-white sm:h-12 sm:w-12 sm:rounded-2xl">
              <Icon size={21} />
            </div>

            {/* Content */}
            <div className="mt-5 sm:mt-6">
              <h3 className="text-lg font-extrabold leading-tight tracking-tight text-gray-900 sm:text-xl">
                {capability.title}
              </h3>

              <p className="mt-2.5 text-sm leading-6 text-gray-600 sm:mt-3">
                {capability.description}
              </p>
            </div>

            {/* Action */}
            {capability.action && capability.to ? (
              <Link
                to={capability.to}
                className="group/link mt-auto inline-flex min-h-10 items-center gap-2 pt-5 text-sm font-bold text-green-700 sm:pt-6"
              >
                {capability.action}

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover/link:translate-x-1"
                />
              </Link>
            ) : (
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[11px] font-semibold text-gray-400 sm:pt-6 sm:text-xs">
                Expanding on AgricWise
              </span>
            )}
          </article>
        );
      })}
    </div>

    {/* More is being built */}
    <div className="mt-7 overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-sm sm:mt-8 sm:rounded-[28px]">
      <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10">
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 sm:h-11 sm:w-11 sm:rounded-2xl">
            <Coins size={20} />
          </div>

          <div>
            <p className="text-sm font-extrabold text-gray-900 sm:text-base">
              More is being built.
            </p>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              AgricWise will continue to expand with useful
              agricultural services, resources and opportunities.
              New capabilities will be introduced as they become
              ready.
            </p>
          </div>
        </div>

        <Link
          to="/register"
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-bold text-white transition duration-200 hover:bg-green-800 sm:w-fit"
        >
          Create an account
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </div>
</section>


);
}

export default ServicesSection;
