import { Link } from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  Handshake,
  Leaf,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Store,
  Tractor,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

import {
  heroFarm,
  vegetables,
  fruits,
  grains,
  livestock,
} from "../../assets/images";


const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-50 pb-10">

      {/* ========================================= */}
      {/* HERO / APP WELCOME */}
      {/* ========================================= */}

      <section className="relative overflow-hidden bg-green-950">

        <img
          src={heroFarm}
          alt="Agricultural community"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-green-950/95 via-green-900/90 to-green-800/70" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">

          {/* Welcome label */}

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-green-200">
                Welcome to
              </p>

              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                AgricWise
              </h1>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <Leaf
                size={23}
                className="text-green-200"
              />
            </div>

          </div>


          {/* Hero message */}

          <div className="mt-12 max-w-3xl lg:mt-20">

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-green-100 backdrop-blur">
              <Sparkles size={14} />
              Connect. Trade. Grow.
            </span>

            <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">

              Agriculture works
              <span className="block text-yellow-300">
                better together.
              </span>

            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-green-50 sm:text-lg sm:leading-8">

              AgricWise connects people, products, services,
              businesses, knowledge and opportunities across
              the agricultural ecosystem.

            </p>


            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-green-800 shadow-lg transition hover:-translate-y-0.5"
              >
                <Search size={18} />
                Explore
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white hover:text-green-800"
              >
                Join AgricWise
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* QUICK ACTIONS */}
      {/* ========================================= */}

      <section className="relative z-10 mx-auto -mt-5 max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="rounded-3xl bg-white p-4 shadow-xl sm:p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                What do you want to do?
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Participate in the ecosystem your way.
              </p>
            </div>

          </div>


          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

            {[
              {
                icon: ShoppingBasket,
                label: "Buy",
                href: "/products",
              },
              {
                icon: Store,
                label: "Sell",
                href: "/farmer/dashboard",
              },
              {
                icon: Wrench,
                label: "Offer Service",
                href: "/products",
              },
              {
                icon: Search,
                label: "Request",
                href: "/products",
              },
              {
                icon: Users,
                label: "Connect",
                href: "/products",
              },
              {
                icon: MessageCircle,
                label: "Discuss",
                href: "/products",
              },
              {
                icon: BookOpen,
                label: "Learn",
                href: "/products",
              },
              {
                icon: BriefcaseBusiness,
                label: "Opportunities",
                href: "/products",
              },
            ].map((action) => {

              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-slate-50 p-4 text-center transition hover:-translate-y-1 hover:border-green-200 hover:bg-green-50"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700 transition group-hover:bg-green-600 group-hover:text-white">

                    <Icon size={21} />

                  </div>

                  <span className="mt-3 text-sm font-semibold text-gray-700">
                    {action.label}
                  </span>

                </Link>
              );

            })}

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* DISCOVER */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-green-700">
              Discover
            </p>

            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              Explore Agriculture
            </h2>

            <p className="mt-2 max-w-xl text-gray-500">
              Find products and discover what's happening across
              the agricultural ecosystem.
            </p>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-1 font-semibold text-green-700 sm:flex"
          >
            View all
            <ChevronRight size={18} />
          </Link>

        </div>


        {/* Category cards */}

        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {[
            {
              image: vegetables,
              title: "Vegetables",
              text: "Fresh produce",
            },
            {
              image: fruits,
              title: "Fruits",
              text: "Seasonal produce",
            },
            {
              image: grains,
              title: "Grains",
              text: "Staple crops",
            },
            {
              image: livestock,
              title: "Livestock",
              text: "Animals & products",
            },
          ].map((category) => (

            <Link
              key={category.title}
              to="/products"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm"
            >

              <div className="h-44 overflow-hidden sm:h-52">

                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">

                  <h3 className="font-bold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-xs text-white/80">
                    {category.text}
                  </p>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* ========================================= */}
      {/* AGRICWISE ECOSYSTEM */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-wider text-green-700">
              The AgricWise Ecosystem
            </p>

            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              More than buying and selling.
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Agriculture needs more than a marketplace. AgricWise
              brings the people, businesses, services, knowledge and
              opportunities that make agricultural activity work.
            </p>

          </div>


          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Package,
                title: "Products",
                text: "Discover agricultural products, inputs and produce.",
              },
              {
                icon: Wrench,
                title: "Services",
                text: "Find people offering agricultural skills and services.",
              },
              {
                icon: Tractor,
                title: "Equipment",
                text: "Connect around farm machinery, tools and equipment.",
              },
              {
                icon: Search,
                title: "Requests",
                text: "Tell the ecosystem what you need.",
              },
              {
                icon: Handshake,
                title: "People & Businesses",
                text: "Discover agricultural participants and businesses.",
              },
              {
                icon: BookOpen,
                title: "Knowledge & Opportunities",
                text: "Learn, participate and discover new opportunities.",
              },
            ].map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-slate-50 p-5"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.text}
                  </p>

                </div>
              );

            })}

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* HOW IT WORKS */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">

        <div className="rounded-3xl bg-green-900 p-7 text-white sm:p-10 lg:p-12">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-wider text-green-300">
              Simple by design
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              One account. Many possibilities.
            </h2>

            <p className="mt-4 leading-7 text-green-100">
              You don't need to choose a permanent role when you join.
              Participate according to what you need and what you have
              to offer.
            </p>

          </div>


          <div className="mt-9 grid gap-5 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Join",
                text: "Create one simple AgricWise account.",
              },
              {
                number: "02",
                title: "Participate",
                text: "Buy, sell, offer, request, connect or learn.",
              },
              {
                number: "03",
                title: "Grow",
                text: "Build relationships, reputation and opportunities.",
              },
            ].map((step) => (

              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"
              >

                <span className="text-sm font-black text-yellow-300">
                  {step.number}
                </span>

                <h3 className="mt-3 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-100">
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* TRUST */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <ShieldCheck
              size={30}
              className="text-green-700"
            />

            <h3 className="mt-4 font-bold text-gray-900">
              Trust & Reputation
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Build confidence through identity, reviews,
              verification and genuine participation.
            </p>

          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <TrendingUp
              size={30}
              className="text-green-700"
            />

            <h3 className="mt-4 font-bold text-gray-900">
              Grow Your Activity
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Turn your products, skills, services and
              agricultural activity into new opportunities.
            </p>

          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <BarChart3
              size={30}
              className="text-green-700"
            />

            <h3 className="mt-4 font-bold text-gray-900">
              Built for Agriculture
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              A digital environment designed around the
              realities of agricultural commerce and community.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* FINAL CTA */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 to-emerald-600 px-6 py-12 text-center text-white shadow-xl sm:px-10">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <Leaf size={16} />
            Connect. Trade. Grow.
          </span>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Be part of the agricultural ecosystem.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-green-100">
            Whether you are looking for a product, offering a service,
            building a business, making a request, sharing knowledge
            or looking for an opportunity—AgricWise gives you a place
            to connect and participate.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              to="/register"
              className="rounded-xl bg-white px-7 py-3.5 font-bold text-green-700 transition hover:-translate-y-0.5"
            >
              Join AgricWise
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-7 py-3.5 font-bold text-white transition hover:bg-white hover:text-green-700"
            >
              Start Exploring
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};


export default HomePage;