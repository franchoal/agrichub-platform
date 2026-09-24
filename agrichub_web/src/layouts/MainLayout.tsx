import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logoIcon } from "../assets";

import {
  Menu,
  ShoppingCart,
  Bell,
  Package,
  LayoutDashboard,
  User,
} from "lucide-react";

import { heroFarm } from "../assets/images";

import { useAuthStore } from "../store/authStore";
import { useCart } from "../hooks/useCart";
import { useNotifications } from "../hooks/useNotifications";

const MainLayout = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    isAuthenticated,
    user,
    logout,
  } = useAuthStore();

  const { data: cart } = useCart();

  const { data: notifications } = useNotifications({
    enabled: isAuthenticated,
  });

  const unreadNotifications =
    notifications?.results?.filter(
      (notification) => !notification.is_read
    ).length ?? 0;

  const cartCount = cart?.items.length ?? 0;

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-lg">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src={logoIcon}
                alt="AgricWise"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-green-700">
                AgricWise Africa
              </h1>

              <p className="text-[11px] text-gray-500">
                Connect. Trade. Grow.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 lg:flex">

            <Link
              to="/"
              className="font-medium text-gray-700 transition hover:text-green-700"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="font-medium text-gray-700 transition hover:text-green-700"
            >
              About
            </Link>

            <Link
              to="/products"
              className="font-medium text-gray-700 transition hover:text-green-700"
            >
              Explore
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="font-medium text-gray-700 transition hover:text-green-700"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Join AgricWise
                </Link>
              </>
            ) : (
              <>
                {/* ================= COMMON USER ACTIONS ================= */}

                <Link
                  to="/products"
                  className="relative flex items-center gap-2 font-medium text-gray-700 transition hover:text-green-700"
                >
                  <ShoppingCart size={20} />

                  Cart

                  {cartCount > 0 && (
                    <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-2 font-medium text-gray-700 transition hover:text-green-700"
                >
                  <Package size={20} />
                  Orders
                </Link>

                {/* Legacy seller workspace */}

                <Link
                  to="/farmer/dashboard"
                  className="flex items-center gap-2 font-medium text-gray-700 transition hover:text-green-700"
                >
                  <LayoutDashboard size={20} />
                  My Activity
                </Link>

                <Link
                  to="/notifications"
                  className="relative flex items-center gap-2 font-medium text-gray-700 transition hover:text-green-700"
                >
                  <Bell size={20} />

                  Notifications

                  {unreadNotifications > 0 && (
                    <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* ================= USER ================= */}

                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <User
                      size={18}
                      className="text-green-700"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      AgricWise Member
                    </p>
                  </div>

                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-500 px-5 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}

          </nav>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={28} />
          </button>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ================= MOBILE DRAWER ================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}

          <aside className="absolute right-0 top-0 flex h-full w-80 flex-col bg-white shadow-2xl">

            {/* Drawer Header */}

            <div className="relative h-44 overflow-hidden">

              <img
                src={heroFarm}
                alt="AgricWise"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-green-700/70" />

              <div className="relative flex h-full items-center px-6">

                <div>

                  <div className="mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow">
                    <img
                      src={logoIcon}
                      alt="AgricWise Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    AgricWise
                  </h2>

                  <p className="text-sm text-green-100">
                    Connect. Trade. Grow.
                  </p>

                </div>

              </div>

            </div>

            {/* Navigation */}

            <div className="flex-1 space-y-2 overflow-y-auto p-6">

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
              >
                🏠 Home
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
              >
                ℹ️ About
              </Link>

              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
              >
                🌾 Explore
              </Link>

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
                  >
                    👤 Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl bg-green-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                  >
                    🌱 Join AgricWise
                  </Link>
                </>
              ) : (
                <>
                  <hr className="my-4" />

                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
                  >
                    🛒 Cart ({cartCount})
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
                  >
                    📦 Orders
                  </Link>

                  <Link
                    to="/farmer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
                  >
                    📊 My Activity
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 transition hover:bg-green-50"
                  >
                    🔔 Notifications

                    {unreadNotifications > 0 && (
                      <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>
                </>
              )}

            </div>

            {/* Footer */}

            {isAuthenticated && (
              <div className="border-t bg-gray-50 p-6">

                <div className="mb-5">

                  <p className="font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    AgricWise Member
                  </p>

                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-xl border border-red-500 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>

              </div>
            )}

          </aside>

        </div>
      )}

      {/* ================= FOOTER ================= */}

      <footer className="border-t bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">

          <p>
            © {new Date().getFullYear()} AgricWise Africa. Built by Franchoal_Dev Technologies.
          </p>

          <div className="flex items-center gap-6">

            <Link
              to="/"
              className="transition hover:text-green-700"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="transition hover:text-green-700"
            >
              Explore
            </Link>

            <Link
              to="/about"
              className="transition hover:text-green-700"
            >
              About
            </Link>

            <Link
              to="/farmer"
              className="transition hover:text-green-700"
            >
              My Activity
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default MainLayout;