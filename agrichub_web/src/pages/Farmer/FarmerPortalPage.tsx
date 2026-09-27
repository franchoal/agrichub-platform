import { Link } from "react-router-dom";

const FarmerPortalPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}

          <div>
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              AgricWise Marketplace
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-900">
              Farmer
              <span className="text-green-700">
                {" "}
                Portal
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Grow your agricultural business by connecting directly with
              buyers across Nigeria.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌱</span>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Create Your Farm
                  </h3>

                  <p className="text-gray-600">
                    Build trust with buyers by creating a complete farm
                    profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🛒</span>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Sell Your Produce
                  </h3>

                  <p className="text-gray-600">
                    List agricultural products and reach customers nationwide.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📦</span>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Manage Orders
                  </h3>

                  <p className="text-gray-600">
                    Track orders and manage your business from one dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📈</span>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Grow Your Business
                  </h3>

                  <p className="text-gray-600">
                    Monitor performance and expand your agricultural business.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}

          <div className="rounded-3xl bg-white p-10 shadow-2xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Welcome Farmer
            </h2>

            <p className="mt-4 text-center text-gray-600">
              Access your farmer account or create one to begin selling on
              AgricWise Marketplace.
            </p>

            <div className="mt-10 space-y-4">
              <Link
                to="/login/farmer"
                className="block w-full rounded-xl bg-green-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-green-700"
              >
                Farmer Login
              </Link>

              <Link
                to="/register/farmer"
                className="block w-full rounded-xl border-2 border-green-600 px-6 py-4 text-center font-semibold text-green-700 transition hover:bg-green-50"
              >
                Create Farmer Account
              </Link>
            </div>

            <div className="mt-10 border-t pt-6 text-center">
              <p className="text-sm text-gray-600">
                Looking to buy fresh farm products?
              </p>

              <Link
                to="/products"
                className="mt-2 inline-block font-semibold text-green-700 hover:underline"
              >
                Browse Marketplace
              </Link>
            </div>

            <div className="mt-8 rounded-xl bg-green-50 p-5">
              <h3 className="font-semibold text-green-800">
                Why Join AgricWise?
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>✓ Reach buyers across Nigeria</li>
                <li>✓ Manage products easily</li>
                <li>✓ Secure order management</li>
                <li>✓ Sales analytics and business insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FarmerPortalPage;
