import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/Home/HomePage";
import AboutPage from "../pages/About/AboutPage";

import ProductsPage from "../pages/Products/ProductsPage";
import ProductDetailsPage from "../pages/Products/ProductDetailsPage";
import CreateProductPage from "../pages/Products/CreateProductPage";
import EditProductPage from "../pages/Products/EditProductPage";

import CartPage from "../pages/Cart/CartPage";

import CheckoutPage from "../pages/Checkout/CheckoutPage";

import OrdersPage from "../pages/Orders/OrdersPage";
import OrderDetailsPage from "../pages/Orders/OrderDetailsPage";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";

import FarmerPortalPage from "../pages/Farmer/FarmerPortalPage";
import FarmerDashboardPage from "../pages/Farmer/FarmerDashboardPage";
import FarmerOrdersPage from "../pages/Farmer/FarmerOrdersPage";
import FarmerOrderDetailsPage from "../pages/Farmer/FarmerOrderDetailsPage";
import FarmerProfilePage from "../pages/Farmer/FarmerProfilePage";

import NotificationsPage from "../pages/Notifications/NotificationsPage";

import CreatePostPage from "../pages/Community/CreatePostPage";

import ProfilePage from "../pages/Profile/ProfilePage";

import ProtectedRoute from "./ProtectedRoute";
import FarmerRoute from "./FarmerRoute";

export const router = createBrowserRouter([
  /*
  ==========================================
  PUBLIC AGRICWISE ECOSYSTEM
  ==========================================
  */

  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "about",
        element: <AboutPage />,
      },

      {
        path: "products",
        element: <ProductsPage />,
      },

      {
        path: "products/:id",
        element: <ProductDetailsPage />,
      },

      {
        path: "community/create",
        element: <CreatePostPage />,
      },

      /*
      ======================================
      TRANSITIONAL SELLER ENTRY
      ======================================

      The existing farmer portal is retained
      temporarily while the seller/business
      workspace is being migrated.

      The broader AgricWise architecture no
      longer treats Farmer as an account type.
      */

      {
        path: "farmer",
        element: <FarmerPortalPage />,
      },
    ],
  },

  /*
  ==========================================
  AUTHENTICATION
  ==========================================

  AgricWise uses one account for everyone.

  No buyer/farmer account type is required.
  */

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  /*
  ==========================================
  LEGACY AUTH URL COMPATIBILITY
  ==========================================

  Existing links to former buyer/farmer
  authentication URLs continue to work.

  They now lead to the single AgricWise
  authentication experience.
  */

  {
    path: "/login/buyer",
    element: (
      <Navigate
        to="/login"
        replace
      />
    ),
  },

  {
    path: "/register/buyer",
    element: (
      <Navigate
        to="/register"
        replace
      />
    ),
  },

  {
    path: "/login/farmer",
    element: (
      <Navigate
        to="/login"
        replace
      />
    ),
  },

  {
    path: "/register/farmer",
    element: (
      <Navigate
        to="/register"
        replace
      />
    ),
  },

  /*
  ==========================================
  AUTHENTICATED AGRICWISE USERS
  ==========================================

  Everything inside this section requires
  authentication.

  The universal /profile route is deliberately
  outside FarmerRoute.

  Every AgricWise person has a personal profile,
  regardless of whether they sell, buy, farm,
  offer services, or simply participate in
  the community.
  */

  {
    element: <ProtectedRoute />,

    children: [
      /*
      ======================================
      UNIVERSAL PERSONAL PROFILE
      ======================================

      This is the primary profile for every
      AgricWise member.

      It is NOT a FarmerProfile.
      */

      {
        path: "/profile",
        element: <ProfilePage />,
      },

      /*
      ======================================
      COMMON AGRICWISE ACTIVITY
      ======================================
      */

      {
        path: "/cart",
        element: <CartPage />,
      },

      {
        path: "/checkout",
        element: <CheckoutPage />,
      },

      {
        path: "/orders",
        element: <OrdersPage />,
      },

      {
        path: "/orders/:id",
        element: <OrderDetailsPage />,
      },

      {
        path: "/notifications",
        element: <NotificationsPage />,
      },

      /*
      ======================================
      TRANSITIONAL FARMER/SELLER WORKSPACE
      ======================================

      These routes remain temporarily because
      the existing Product and Order models still
      use FarmerProfile as the seller capability.

      FarmerRoute only protects this workspace.

      It does NOT define the user's identity.
      */

      {
        element: <FarmerRoute />,

        children: [
          {
            path: "/farmer/dashboard",
            element: <FarmerDashboardPage />,
          },

          {
            path: "/farmer/orders",
            element: <FarmerOrdersPage />,
          },

          {
            path: "/farmer/orders/:id",
            element: <FarmerOrderDetailsPage />,
          },

          {
            path: "/farmer/profile",
            element: <FarmerProfilePage />,
          },

          {
            path: "/farmer/products/create",
            element: <CreateProductPage />,
          },

          {
            path: "/farmer/products/:id/edit",
            element: <EditProductPage />,
          },
        ],
      },
    ],
  },

  /*
  ==========================================
  FALLBACK
  ==========================================
  */

  {
    path: "*",
    element: (
      <Navigate
        to="/"
        replace
      />
    ),
  },
]);