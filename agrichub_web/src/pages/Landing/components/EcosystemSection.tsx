import {
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  FlaskConical,
  GraduationCap,
  HandCoins,
  Leaf,
  MapPinned,
  ShieldCheck,
  Tractor,
} from "lucide-react";

const ecosystemAreas = [
  {
    icon: HandCoins,
    title: "Finance & Funding",
    description:
      "Access to agricultural finance, funding opportunities and financial support as the ecosystem expands.",
  },
  {
    icon: Leaf,
    title: "Seeds & Farm Inputs",
    description:
      "Discover seeds, fertilizers, crop protection products and other essential farm inputs.",
  },
  {
    icon: Tractor,
    title: "Equipment & Machinery",
    description:
      "Find agricultural tools, machinery and equipment for different stages of farm production.",
  },
  {
    icon: MapPinned,
    title: "Logistics & Distribution",
    description:
      "Better visibility into the movement of agricultural products from source to destination.",
  },
  {
    icon: GraduationCap,
    title: "Training & Extension",
    description:
      "Practical learning, technical guidance and agricultural extension resources.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance",
    description:
      "Future access to agricultural risk-management and insurance opportunities.",
  },
  {
    icon: FlaskConical,
    title: "Research & Innovation",
    description:
      "A space for agricultural knowledge, new ideas, technology and innovation.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Agricultural Businesses",
    description:
      "Greater visibility for businesses serving farmers and the wider agricultural value chain.",
  },
];

function EcosystemSection() {
  return (
    <section className="relative overflow-hidden bg-[#F6FAF3] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-40 top-0 h-72 w-72 rounded-full bg-green-200/40 blur-3xl sm:h-96 sm:w-96" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-lime-100/70 blur-3xl sm:h-[30rem] sm:w-[30rem]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section introduction */}
        <div className="grid gap-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700 shadow-sm sm:px-4 sm:text-xs sm:tracking-[0.18em]">
              <CircleDollarSign size={14} />
              The Growing Ecosystem
            </div>

            <h2 className="mt-4 max-w-xl text-[2rem] font-black leading-[1.08] tracking-tight text-gray-900 sm:mt-5 sm:text-4xl lg:text-5xl">
              Growing beyond the{" "}
              <span className="text-green-600">
                marketplace.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-gray-600 sm:mt-5 sm:text-lg sm:leading-8">
              Agriculture depends on more than buying and selling.
              AgricWise is designed to make useful parts of the wider
              value chain easier to discover as the platform grows.
            </p>
          </div>

          {/* Bigger picture card */}
          <div className="rounded-[24px] bg-green-800 p-5 text-white shadow-xl shadow-green-900/10 sm:rounded-[28px] sm:p-8">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 sm:h-11 sm:w-11 sm:rounded-2xl">
                <Leaf size={20} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-green-300 sm:text-[10px]">
                  The bigger picture
                </p>

                <h3 className="mt-2 text-lg font-extrabold leading-tight sm:text-2xl">
                  More of agriculture, in one place.
                </h3>

                <p className="mt-2.5 text-sm leading-6 text-green-100/75 sm:mt-3">
                  As AgricWise develops, more useful services,
                  businesses, resources and opportunities can become
                  easier to find through the platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ecosystem cards */}
        <div className="mt-9 grid grid-cols-1 gap-3 sm:mt-11 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {ecosystemAreas.map((area) => {
            const Icon = area.icon;

            return (
              <article
                key={area.title}
                className="group relative flex min-h-[245px] flex-col overflow-hidden rounded-[24px] border border-green-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-h-[270px] sm:rounded-[26px] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 transition duration-300 group-hover:bg-green-700 group-hover:text-white sm:rounded-2xl">
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                    Growing
                  </span>
                </div>

                <h3 className="mt-5 text-base font-extrabold leading-tight text-gray-900 sm:text-lg">
                  {area.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {area.description}
                </p>

                <div className="mt-auto flex items-center gap-1.5 pt-5 text-[10px] font-bold text-green-600 sm:text-[11px]">
                  <span>Coming to AgricWise</span>

                  <ChevronRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* Growing message */}
        <div className="mt-7 rounded-[22px] border border-green-100 bg-white px-5 py-5 shadow-sm sm:mt-8 sm:rounded-[24px] sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <CircleDollarSign size={19} />
              </div>

              <p className="text-sm font-semibold leading-6 text-gray-600">
                New capabilities will be introduced as they become
                ready.
              </p>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Growing with agriculture
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EcosystemSection;
