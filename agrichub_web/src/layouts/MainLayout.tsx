import {
  Bell,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  ShoppingCart,
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
// import { useCartStore } from "../store/cartStore";


const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();
  // const { items } = useCartStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===================================== */}
      {/* DESKTOP / TABLET HEADER */}
      {/* ===================================== */}

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}

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


          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-1 md:flex">

            <Link
              to="/"
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive("/")
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive("/products")
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
              }`}
            >
              Marketplace
            </Link>

            {user && (
              <Link
                to="/farmer/dashboard"
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive("/farmer")
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                }`}
              >
                My Activity
              </Link>
            )}

          </nav>


          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-2 md:flex">

            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                  aria-label="Notifications"
                >
                  <Bell size={19} />
                </Link>

                <Link
                  to="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                  aria-label="Cart"
                >
                </Link>

                <Link
                  to="/profile"
                  className="ml-1 flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-gray-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <User size={16} />
                  </div>

                  <span className="max-w-32 truncate text-sm font-semibold text-gray-700">
                    {user.first_name || user.email}
                  </span>
                </Link>

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
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
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


          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-50 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>


        {/* ===================================== */}
        {/* MOBILE DROPDOWN MENU */}
        {/* ===================================== */}

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">

            <div className="space-y-1">

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
              >
                <Home size={18} />
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
              >
                <ShoppingCart size={18} />
                Marketplace
              </Link>

              {user && (
                <>
                  <Link
                    to="/notifications"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <Bell size={18} />
                    Notifications
                  </Link>

                  <Link
                    to="/cart"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart size={18} />
                      Cart
                    </span>

                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}

              {!user && (
  <div className="mt-2 space-y-2">
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


      {/* ===================================== */}
      {/* PAGE CONTENT */}
      {/* ===================================== */}

      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>


      {/* ===================================== */}
      {/* MOBILE APP BOTTOM NAVIGATION */}
      {/* ===================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">

        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">

          {/* HOME */}

          <Link
            to="/"
            className={`flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 ${
              isActive("/")
                ? "text-green-700"
                : "text-gray-400"
            }`}
          >
            <Home
              size={20}
              strokeWidth={isActive("/") ? 2.5 : 2}
            />

            <span className="text-[10px] font-semibold">
              Home
            </span>
          </Link>


          {/* DISCOVER */}

          <Link
            to="/products"
            className={`flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 ${
              isActive("/products")
                ? "text-green-700"
                : "text-gray-400"
            }`}
          >
            <Search
              size={20}
              strokeWidth={isActive("/products") ? 2.5 : 2}
            />

            <span className="text-[10px] font-semibold">
              Discover
            </span>
          </Link>


          {/* POST */}

          {user ? (
            <Link
              to="/"
              className="flex min-w-14 flex-col items-center justify-center gap-1 px-2 py-1.5"
            >
              <span className="flex h-10 w-10 -translate-y-3 items-center justify-center rounded-full bg-green-700 text-white shadow-lg ring-4 ring-white">
                <Plus size={23} strokeWidth={2.5} />
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
                <Plus size={23} strokeWidth={2.5} />
              </span>

              <span className="-mt-2 text-[10px] font-semibold text-gray-500">
                Post
              </span>
            </Link>
          )}


          {/* MESSAGES */}

          <Link
            to="/messages"
            className={`flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 ${
              isActive("/messages")
                ? "text-green-700"
                : "text-gray-400"
            }`}
          >
            <MessageCircle
              size={20}
              strokeWidth={isActive("/messages") ? 2.5 : 2}
            />

            <span className="text-[10px] font-semibold">
              Messages
            </span>
          </Link>


          {/* PROFILE */}

          <Link
            to="/profile"
            className={`flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 ${
              isActive("/profile")
                ? "text-green-700"
                : "text-gray-400"
            }`}
          >
            <User
              size={20}
              strokeWidth={isActive("/profile") ? 2.5 : 2}
            />

            <span className="text-[10px] font-semibold">
              Profile
            </span>
          </Link>

        </div>

      </nav>


      {/* ===================================== */}
      {/* DESKTOP FOOTER */}
      {/* ===================================== */}

      <footer className="hidden border-t border-gray-100 bg-white md:block">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          <div>
            <p className="text-sm font-bold text-gray-800">
              AgricWise Africa
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Connect. Trade. Grow.
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium text-gray-500">
            <Link
              to="/"
              className="hover:text-green-700"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="hover:text-green-700"
            >
              Marketplace
            </Link>

            <Link
              to="/profile"
              className="hover:text-green-700"
            >
              Profile
            </Link>
          </div>

        </div>

      </footer>

    </div>
  );
};


export default MainLayout;