import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  Factory,
  MapPin,
  Package,
  Settings2,
  ShieldCheck,
  Store,
  Tractor,
  Users,
  Wrench,
} from "lucide-react";

import FarmerProfileForm from "../../components/farmer/FarmerProfileForm";

const profileFoundation = [
  {
    icon: Building2,
    title: "Business Identity",
    description:
      "Create the business or professional identity customers, partners, and the wider agricultural community will see on AgricWise.",
    className: "border-green-100 bg-green-50/60",
    iconClassName: "bg-green-100 text-green-700",
  },
  {
    icon: Settings2,
    title: "Agricultural Focus",
    description:
      "Select the areas of agriculture your business operates in so your AgricWise presence accurately reflects what you do.",
    className: "border-blue-100 bg-blue-50/60",
    iconClassName: "bg-blue-100 text-blue-700",
  },
  {
    icon: MapPin,
    title: "Operating Location",
    description:
      "Add where your business operates so customers and relevant opportunities can better understand your agricultural presence.",
    className: "border-purple-100 bg-purple-50/60",
    iconClassName: "bg-purple-100 text-purple-700",
  },
  {
    icon: ShieldCheck,
    title: "Build Trust",
    description:
      "Accurate business information creates the foundation for verification and a stronger, more credible AgricWise presence.",
    className: "border-orange-100 bg-orange-50/60",
    iconClassName: "bg-orange-100 text-orange-700",
  },
];

const setupSteps = [
  {
    number: "01",
    icon: Building2,
    title: "Define your business",
    description:
      "Add your business name, operating location, description, and agricultural focus.",
  },
  {
    number: "02",
    icon: Package,
    title: "Show what you offer",
    description:
      "Use your Business Workspace to manage products and agricultural services.",
  },
  {
    number: "03",
    icon: Users,
    title: "Grow your presence",
    description:
      "Build visibility and connections with customers, businesses, professionals, and the wider agricultural community.",
  },
];

const valueChainGroups = [
  {
    icon: Tractor,
    label: "Production",
    description: "Grow and produce agricultural goods.",
    items: [
      "Crop & Plant Farming",
      "Livestock & Poultry",
      "Fish Farming",
    ],
  },
  {
    icon: Store,
    label: "Supply",
    description: "Provide products and agricultural inputs.",
    items: [
      "Agro-input Supplier",
      "Agro-allied Products",
    ],
  },
  {
    icon: Wrench,
    label: "Infrastructure",
    description: "Support farming with tools and infrastructure.",
    items: [
      "Equipment & Machinery",
      "Irrigation & Greenhouse",
    ],
  },
  {
    icon: Factory,
    label: "Value Addition",
    description: "Move agricultural products through the value chain.",
    items: [
      "Agro-processing",
      "Produce Buyer / Aggregator",
    ],
  },
  {
    icon: Compass,
    label: "Knowledge & Services",
    description: "Provide expertise, support, and professional services.",
    items: [
      "Agricultural Services",
      "Training & Consultancy",
    ],
  },
];

const FarmerProfilePage = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* ==================================================
            PAGE HERO
        ================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 px-5 py-7 text-white shadow-xl sm:mb-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10"
            aria-hidden="true"
          />

          <div
            className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-300/10"
            aria-hidden="true"
          />

          <div
            className="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-white/5"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-green-50 backdrop-blur-sm">
                <Building2 className="h-3.5 w-3.5" />
                My AgricWise Business
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-medium text-emerald-50">
                <Settings2 className="h-3.5 w-3.5" />
                Business Setup
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Build your AgricWise business presence
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-green-50 sm:text-base sm:leading-8">
              Your AgricWise Business profile is the foundation of how people
              discover, understand, and connect with your agricultural
              business, enterprise, organization, or professional activity.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-emerald-300" />

                <p className="mt-3 text-sm font-semibold text-white">
                  Establish your identity
                </p>

                <p className="mt-1 text-xs leading-5 text-green-100/75">
                  Tell AgricWise who you are and what your business does.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <Package className="h-5 w-5 text-emerald-300" />

                <p className="mt-3 text-sm font-semibold text-white">
                  Showcase what you offer
                </p>

                <p className="mt-1 text-xs leading-5 text-green-100/75">
                  Products and services become part of your public presence.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <Users className="h-5 w-5 text-emerald-300" />

                <p className="mt-3 text-sm font-semibold text-white">
                  Join the ecosystem
                </p>

                <p className="mt-1 text-xs leading-5 text-green-100/75">
                  Become discoverable within the wider agricultural community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            BUSINESS FOUNDATION
        ================================================== */}

        <section
          className="mb-6 sm:mb-8"
          aria-labelledby="business-foundation"
        >
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
              Your agricultural identity
            </p>

            <h2
              id="business-foundation"
              className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Build your business foundation
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These core details establish the structured identity AgricWise
              uses to represent your business and connect it with the right
              parts of the ecosystem.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {profileFoundation.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className={`rounded-2xl border p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${item.className}`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            BUSINESS PROFILE FORM
        ================================================== */}

        <section
          aria-labelledby="business-information"
          className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm sm:mb-8"
        >
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700">
                    <Building2 className="h-4 w-4" />
                  </span>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                    Business foundation
                  </p>
                </div>

                <h2
                  id="business-information"
                  className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                >
                  Tell us about your business
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Provide accurate information about your farm, enterprise,
                  company, organization, or agricultural professional activity.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Step 1 of your business setup
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <FarmerProfileForm />
          </div>
        </section>

        {/* ==================================================
            AGRICULTURAL VALUE CHAIN
        ================================================== */}

        <section
          className="mb-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm sm:mb-8"
          aria-labelledby="value-chain"
        >
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-green-700">
                <Users className="h-3.5 w-3.5" />
                One agricultural ecosystem
              </span>

              <h2
                id="value-chain"
                className="mt-3 text-2xl font-bold tracking-tight text-slate-900"
              >
                There is a place for your business here
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                AgricWise connects participants across the agricultural value
                chain. Your business does not have to fit into a single
                traditional “farmer” or “buyer” label.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {valueChainGroups.map((group) => {
                const Icon = group.icon;

                return (
                  <article
                    key={group.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                        <Icon className="h-4.5 w-4.5" />
                      </span>

                      <h3 className="text-sm font-bold text-slate-900">
                        {group.label}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      {group.description}
                    </p>

                    <div className="mt-4 space-y-2">
                      {group.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-lg bg-white px-3 py-2 text-xs font-medium leading-5 text-slate-600"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            BUSINESS JOURNEY
        ================================================== */}

        <section
          className="mb-6 sm:mb-8"
          aria-labelledby="business-journey"
        >
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
              Your AgricWise journey
            </p>

            <h2
              id="business-journey"
              className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Build it in stages
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Start with a strong identity. Then use your Business Workspace
              to expand what people can discover, buy, and engage with.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {setupSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                      {step.number}
                    </span>

                    <Icon className="h-5 w-5 text-green-600" />

                    {index < setupSteps.length - 1 && (
                      <ArrowRight
                        className="hidden text-slate-200 md:absolute md:right-4 md:top-8 md:block"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            BUSINESS WORKSPACE BRIDGE
        ================================================== */}

        <section className="mb-6 overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl sm:mb-8">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div
              className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-500/10"
              aria-hidden="true"
            />

            <div
              className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-emerald-500/5"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-400">
                  What comes next
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Turn your profile into a business presence
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Once your business identity is established, your AgricWise
                  Business Workspace becomes the place to manage products,
                  agricultural services, orders, verification, and your growing
                  presence across the ecosystem.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Products",
                    "Services",
                    "Orders",
                    "Business Presence",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm lg:min-w-[250px]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                  <Building2 className="h-5 w-5" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Business workspace
                </p>

                <p className="mt-2 text-base font-semibold text-white">
                  Your AgricWise Command Center
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                  Build your presence one step at a time
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            TRUST FOOTNOTE
        ================================================== */}

        <div className="flex items-center justify-center gap-2 px-1 py-6 text-center sm:py-8">
          <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />

          <p className="text-xs leading-5 text-slate-400">
            Start with accurate information. Build your AgricWise presence as
            your business grows.
          </p>
        </div>
      </div>
    </main>
  );
};

export default FarmerProfilePage;