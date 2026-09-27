import FarmerProfileForm from "../../components/farmer/FarmerProfileForm";

const FarmerProfilePage = () => {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}

      <div className="mb-10">
        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          Farmer Onboarding
        </span>

        <h1 className="mt-5 text-4xl font-bold text-gray-900">
          Complete Your Farm Profile
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
          Before you can start selling on AgricWise Marketplace,
          tell buyers about your farm. A complete farm profile
          builds trust, improves visibility and unlocks your
          farmer dashboard.
        </p>
      </div>

      {/* Benefits */}

      <div className="mb-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-3 text-3xl">
            🌱
          </div>

          <h3 className="font-semibold text-gray-900">
            Build Trust
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Buyers are more likely to purchase from farmers
            with complete and verified farm information.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <div className="mb-3 text-3xl">
            🛒
          </div>

          <h3 className="font-semibold text-gray-900">
            Start Selling
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Your farmer profile must be completed before you
            can list products on the marketplace.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <div className="mb-3 text-3xl">
            📈
          </div>

          <h3 className="font-semibold text-gray-900">
            Grow Your Business
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Access product management, orders, customers and
            future sales analytics from your dashboard.
          </p>
        </div>
      </div>

      {/* Profile Form */}

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <FarmerProfileForm />
      </div>
    </main>
  );
};

export default FarmerProfilePage;
