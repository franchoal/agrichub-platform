import FarmerProfileForm from "../../components/farmer/FarmerProfileForm";

const FarmerProfilePage = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 px-5 py-7 text-white shadow-lg sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10 max-w-4xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-green-50 backdrop-blur-sm">
              AgricWise Business Profile
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Build Your Agricultural Business Presence
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-green-50 sm:text-base sm:leading-8">
              Tell the AgricWise community who you are, what you offer,
              and where you operate. Your business profile helps farmers,
              buyers, businesses, and agricultural professionals discover
              and connect with you.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Farmers",
                "Input Suppliers",
                "Equipment Providers",
                "Consultants",
                "Processors",
                "Buyers",
              ].map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            PROFILE PURPOSE
        ================================================== */}

        <section
          aria-labelledby="profile-purpose"
          className="mb-8"
        >
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Your Digital Presence
            </p>

            <h2
              id="profile-purpose"
              className="mt-1 text-2xl font-bold text-gray-900"
            >
              Tell People About Your Business
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Your AgricWise business profile represents your place in
              the wider agricultural ecosystem. It is designed for
              businesses, producers, suppliers, buyers, service providers,
              and agricultural professionals.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                🏢
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Business Identity
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Establish a clear identity for your agricultural business
                or professional activity.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🧭
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Business Categories
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Help people quickly understand the areas of agriculture
                your business operates in.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                📍
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Operating Location
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Let customers and agricultural partners know where your
                business operates.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                ✓
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Build Trust
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Accurate business information provides a stronger
                foundation for AgricWise verification.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            AGRICWISE BUSINESS ECOSYSTEM
        ================================================== */}

        <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                One Agricultural Ecosystem
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                AgricWise Is Built for the Whole Value Chain
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Whether you grow crops, supply inputs, provide equipment,
                process agricultural products, offer professional services,
                train others, or buy produce, your business has a place
                on AgricWise.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[420px]">
              {[
                "🌱 Farmers",
                "🧪 Input Suppliers",
                "🚜 Equipment",
                "🧑🏾‍💼 Consultants",
                "🏭 Processors",
                "🛒 Buyers",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-gray-50 px-3 py-3 text-center text-xs font-medium text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            BUSINESS SETUP STEPS
        ================================================== */}

        <section className="mb-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Business Setup
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Build Your AgricWise Presence
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Start with the essentials. You can continue expanding your
              business presence from your Business Dashboard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                1
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Define Your Business
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Add your business name, location, description, and
                agricultural categories.
              </p>
            </div>

            <div className="relative rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                2
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Showcase What You Offer
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Add your products and agricultural services from your
                Business Dashboard.
              </p>
            </div>

            <div className="relative rounded-2xl border border-purple-100 bg-purple-50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                3
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Grow Your Network
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Connect with customers, businesses, and professionals
                across the AgricWise ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            BUSINESS INFORMATION FORM
        ================================================== */}

        <section
          aria-labelledby="business-information"
          className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                  Business Details
                </p>

                <h2
                  id="business-information"
                  className="mt-1 text-2xl font-bold text-gray-900"
                >
                  Business Information
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Provide accurate information about your agricultural
                  business, enterprise, or professional activity.
                </p>
              </div>

              <div className="hidden rounded-xl bg-green-100 px-4 py-2 text-xs font-semibold text-green-700 sm:block">
                AgricWise Business Profile
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <FarmerProfileForm />
          </div>
        </section>

        {/* ==================================================
            AFTER PROFILE SETUP
        ================================================== */}

        <section className="mt-8 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-400">
                Next Step
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your Business Profile Is Just the Beginning
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-300">
                Once your profile is set up, use your AgricWise Business
                Dashboard to manage products, services, customer orders,
                and your growing digital presence.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Your Workspace
              </p>

              <p className="mt-1 font-semibold text-white">
                Business Command Center
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FarmerProfilePage;