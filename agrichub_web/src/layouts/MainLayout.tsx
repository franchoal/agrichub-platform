import {
  Bell,
  Building2,
  Home,
  LogOut,
  Menu,
  Plus,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { logoIcon } from "../assets/logo";
import { useAuthStore } from "../store/authStore";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /*
  ========================================================
  ACTIVE ROUTE
  ========================================================
  */

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  /*
  ========================================================
  LOGOUT
  ========================================================
  */

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  /*
  ========================================================
  CLOSE MOBILE MENU
  ========================================================
  */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /*
  ========================================================
  NAVIGATION ITEM STYLES
  ========================================================
  */

  const desktopNavClass = (path: string) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive(path)
        ? "bg-green-50 text-green-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
    }`;

  const mobileNavClass = (path: string) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
      isActive(path)
        ? "bg-green-50 text-green-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
    }`;

  const bottomNavClass = (path: string) =>
    `flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition ${
      isActive(path)
        ? "text-green-700"
        : "text-gray-400"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700">
              <img
                src={logoIcon}
                alt="AgricWise Africa"
                className="h-9 w-9 object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <div className="text-lg font-black leading-none text-green-800">
                AgricWise
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Connect. Trade. Grow.
              </div>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className={desktopNavClass("/")}
            >
              Home
            </Link>

            <Link
              to="/businesses"
              className={desktopNavClass("/businesses")}
            >
              Businesses
            </Link>

            <Link
              to="/products"
              className={desktopNavClass("/products")}
            >
              Marketplace
            </Link>

            {user && (
              <Link
                to="/farmer"
                className={desktopNavClass("/farmer")}
              >
                My Business
              </Link>
            )}
          </nav>

          {/* =================================================
              DESKTOP ACTIONS
          ================================================= */}

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {/* NOTIFICATIONS */}

                <Link
                  to="/notifications"
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    isActive("/notifications")
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                  }`}
                  aria-label="Notifications"
                >
                  <Bell size={19} />
                </Link>

                {/* PROFILE */}

                <Link
                  to="/profile"
                  className={`ml-1 flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                    isActive("/profile")
                      ? "bg-green-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <User size={16} />
                  </div>

                  <span className="max-w-32 truncate text-sm font-semibold text-gray-700">
                    {user.first_name || user.email}
                  </span>
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login/buyer"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800"
                >
                  Join AgricWise
                </Link>
              </>
            )}
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((current) => !current)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-50 md:hidden"
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {/* ==================================================
            MOBILE MENU
        ================================================== */}

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-sm md:hidden">
            <div className="space-y-1">
              {/* HOME */}

              <Link
                to="/"
                onClick={closeMobileMenu}
                className={mobileNavClass("/")}
              >
                <Home size={18} />
                Home
              </Link>

              {/* BUSINESSES */}

              <Link
                to="/businesses"
                onClick={closeMobileMenu}
                className={mobileNavClass("/businesses")}
              >
                <Building2 size={18} />
                Agricultural Businesses
              </Link>

              {/* MARKETPLACE */}

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className={mobileNavClass("/products")}
              >
                <ShoppingBag size={18} />
                Marketplace
              </Link>

              {user && (
                <>
                  {/* BUSINESS WORKSPACE */}

                  <Link
                    to="/farmer"
                    onClick={closeMobileMenu}
                    className={mobileNavClass("/farmer")}
                  >
                    <Building2 size={18} />
                    My Business
                  </Link>

                  {/* NOTIFICATIONS */}

                  <Link
                    to="/notifications"
                    onClick={closeMobileMenu}
                    className={mobileNavClass(
                      "/notifications"
                    )}
                  >
                    <Bell size={18} />
                    Notifications
                  </Link>

                  {/* PROFILE */}

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className={mobileNavClass("/profile")}
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                  <Link
                    to="/login/buyer"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                  >
                    Join AgricWise
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* ==================================================
          MOBILE APP BOTTOM NAVIGATION
      ================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {/* HOME */}

          <Link
            to="/"
            className={bottomNavClass("/")}
          >
            <Home
              size={20}
              strokeWidth={
                isActive("/") ? 2.5 : 2
              }
            />

            <span className="text-[10px] font-semibold">
              Home
            </span>
          </Link>

          {/* BUSINESSES */}

          <Link
            to="/businesses"
            className={bottomNavClass("/businesses")}
          >
            <Building2
              size={20}
              strokeWidth={
                isActive("/businesses") ? 2.5 : 2
              }
            />

            <span className="text-[10px] font-semibold">
              Businesses
            </span>
          </Link>

          {/* CREATE / POST */}

          {user ? (
            <Link
              to="/"
              className="flex min-w-14 flex-col items-center justify-center gap-1 px-2 py-1.5"
            >
              <span className="flex h-10 w-10 -translate-y-3 items-center justify-center rounded-full bg-green-700 text-white shadow-lg ring-4 ring-white">
                <Plus
                  size={23}
                  strokeWidth={2.5}
                />
              </span>

              <span className="-mt-2 text-[10px] font-semibold text-gray-500">
                Post
              </span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="flex min-w-14 flex-col items-center justify-center gap-1 px-2 py-1.5"
            >
              <span className="flex h-10 w-10 -translate-y-3 items-center justify-center rounded-full bg-green-700 text-white shadow-lg ring-4 ring-white">
                <Plus
                  size={23}
                  strokeWidth={2.5}
                />
              </span>

              <span className="-mt-2 text-[10px] font-semibold text-gray-500">
                Join
              </span>
            </Link>
          )}

          {/* MARKETPLACE */}

          <Link
            to="/products"
            className={bottomNavClass("/products")}
          >
            <ShoppingBag
              size={20}
              strokeWidth={
                isActive("/products") ? 2.5 : 2
              }
            />

            <span className="text-[10px] font-semibold">
              Market
            </span>
          </Link>

          {/* PROFILE */}

          <Link
            to={user ? "/profile" : "/login/buyer"}
            className={bottomNavClass("/profile")}
          >
            <User
              size={20}
              strokeWidth={
                isActive("/profile") ? 2.5 : 2
              }
            />

            <span className="text-[10px] font-semibold">
              {user ? "Profile" : "Login"}
            </span>
          </Link>
        </div>
      </nav>

      {/* ==================================================
          DESKTOP FOOTER
      ================================================== */}

      <footer className="hidden border-t border-gray-100 bg-white md:block">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* BRAND */}

            <div>
              <p className="text-sm font-bold text-gray-800">
                AgricWise Africa
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Connect. Trade. Grow.
              </p>
            </div>

            {/* NAVIGATION */}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-gray-500">
              <Link
                to="/"
                className="transition hover:text-green-700"
              >
                Home
              </Link>

              <Link
                to="/businesses"
                className="transition hover:text-green-700"
              >
                Businesses
              </Link>

              <Link
                to="/products"
                className="transition hover:text-green-700"
              >
                Marketplace
              </Link>

              <Link
                to="/profile"
                className="transition hover:text-green-700"
              >
                Profile
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-center text-[11px] text-gray-400 sm:text-left">
              Agriculture works better together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;