import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  Sprout,
  Tractor,
  Warehouse,
  ShieldCheck,
  Users,
  BarChart3,
} from "lucide-react";

const AboutPage = () => {
  return (
    <main className="bg-white">

      {/* =======================================================
          HERO
      ======================================================== */}

      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <span className="rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
            Africa's Smart Agricultural Ecosystem
          </span>

          <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">
            Building the Digital Infrastructure
            for African Agriculture.
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-green-100">

            AgricWise Africa is creating one connected ecosystem where
            farmers, buyers, transporters, suppliers, financial institutions,
            extension officers and governments can interact seamlessly.

            Our mission is simple:

            Make African agriculture more productive,
            profitable and sustainable through technology.

          </p>

          <div className="mt-12 flex flex-wrap gap-5">

            <Link
              to="/products"
              className="rounded-2xl bg-white px-8 py-4 font-bold text-green-800 transition hover:scale-105"
            >
              Explore Marketplace
            </Link>

            <Link
              to="/farmer"
              className="rounded-2xl border border-white px-8 py-4 font-bold transition hover:bg-white hover:text-green-800"
            >
              Join AgricWise
            </Link>

          </div>

        </div>

      </section>

      {/* =======================================================
          WHO WE ARE
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="max-w-4xl">

          <h2 className="text-4xl font-bold text-gray-900">

            Who We Are

          </h2>

          <p className="mt-8 text-lg leading-9 text-gray-600">

            AgricWise Africa is more than an online marketplace.

            We are building Africa's digital agricultural ecosystem.

            While many platforms stop at connecting buyers and sellers,
            AgricWise connects every stakeholder within the agricultural value chain.

            Farmers gain access to verified markets.

            Buyers discover trusted producers.

            Suppliers reach thousands of farms.

            Logistics providers move products efficiently.

            Financial institutions identify credible borrowers.

            Governments obtain reliable agricultural data.

            Together, these connections create an ecosystem where agriculture
            becomes smarter, more transparent and more profitable.

          </p>

        </div>

      </section>

      {/* =======================================================
          AFRICAN CHALLENGE
      ======================================================== */}

      <section className="bg-gray-50">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <h2 className="text-4xl font-bold text-center">

            The Challenge

          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-center text-lg leading-9 text-gray-600">

            Africa possesses nearly 65% of the world's uncultivated arable land,
            yet imports billions of dollars worth of food every year.

            Farmers struggle to reach buyers.
            Buyers struggle to find reliable farmers.
            Prices remain unstable.
            Logistics remain fragmented.
            Agricultural data is scarce.

            Technology should solve these problems.

          </p>

        </div>

      </section>

      {/* =======================================================
          SOLUTION
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-center text-4xl font-bold">

          Our Solution

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl border p-8">

            <Sprout className="mb-5 text-green-700" size={40} />

            <h3 className="text-xl font-bold">
              Digital Marketplace
            </h3>

            <p className="mt-4 text-gray-600">
              Farmers connect directly with verified buyers.
            </p>

          </div>

          <div className="rounded-3xl border p-8">

            <Warehouse className="mb-5 text-green-700" size={40} />

            <h3 className="text-xl font-bold">
              Farm Inputs
            </h3>

            <p className="mt-4 text-gray-600">
              Fertilizers, livestock feeds, seeds,
              chemicals and farm equipment.
            </p>

          </div>

          <div className="rounded-3xl border p-8">

            <Tractor className="mb-5 text-green-700" size={40} />

            <h3 className="text-xl font-bold">
              Smart Farming
            </h3>

            <p className="mt-4 text-gray-600">
              Digital tools that improve productivity and decision making.
            </p>

          </div>

          <div className="rounded-3xl border p-8">

            <BarChart3 className="mb-5 text-green-700" size={40} />

            <h3 className="text-xl font-bold">
              Agricultural Intelligence
            </h3>

            <p className="mt-4 text-gray-600">
              Market prices, analytics and valuable agricultural insights.
            </p>

          </div>

        </div>

      </section>

      {/* =======================================================
          VISION
      ======================================================== */}

      <section className="bg-green-900 text-white">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <Globe size={42} />

              <h2 className="mt-6 text-4xl font-bold">

                Vision

              </h2>

              <p className="mt-6 text-lg leading-9 text-green-100">

                To become Africa's leading digital agricultural ecosystem,
                empowering millions of farmers while transforming food
                production, trade and rural prosperity.

              </p>

            </div>

            <div>

              <ShieldCheck size={42} />

              <h2 className="mt-6 text-4xl font-bold">

                Mission

              </h2>

              <p className="mt-6 text-lg leading-9 text-green-100">

                To simplify agriculture through technology by connecting
                every participant within the agricultural value chain.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =======================================================
          IMPACT
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-center text-4xl font-bold">

          Our Expected Impact

        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3">

          <div className="text-center">

            <Users
              size={48}
              className="mx-auto text-green-700"
            />

            <h3 className="mt-5 text-2xl font-bold">

              Millions of Farmers

            </h3>

            <p className="mt-4 text-gray-600">

              Access to larger markets and better income.

            </p>

          </div>

          <div className="text-center">

            <Warehouse
              size={48}
              className="mx-auto text-green-700"
            />

            <h3 className="mt-5 text-2xl font-bold">

              Stronger Supply Chains

            </h3>

            <p className="mt-4 text-gray-600">

              Faster movement of agricultural products.

            </p>

          </div>

          <div className="text-center">

            <Globe
              size={48}
              className="mx-auto text-green-700"
            />

            <h3 className="mt-5 text-2xl font-bold">

              Food Security

            </h3>

            <p className="mt-4 text-gray-600">

              Helping Africa feed itself through innovation.

            </p>

          </div>

        </div>

      </section>

      {/* =======================================================
          CTA
      ======================================================== */}

      <section className="bg-green-700 text-white">

        <div className="mx-auto max-w-6xl px-6 py-24 text-center">

          <h2 className="text-5xl font-bold">

            Join the Future of African Agriculture

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-green-100">

            Whether you're a farmer, buyer,
            logistics provider, supplier,
            investor or government agency,
            AgricWise Africa provides the platform
            to build Africa's agricultural future.

          </p>

          <Link
            to="/register"
            className="mt-12 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-green-700 transition hover:scale-105"
          >

            Get Started

            <ArrowRight size={20} />

          </Link>

        </div>

      </section>

    </main>
  );
};

export default AboutPage;
