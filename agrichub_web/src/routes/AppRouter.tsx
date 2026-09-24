import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import HomePage from "../pages/Home/HomePage";
import AboutPage from "../pages/About/AboutPage";
import FarmerOrdersPage from "../pages/Farmer/FarmerOrdersPage";
import FarmerOrderDetailsPage from "../pages/Farmer/FarmerOrderDetailsPage";

import ProductsPage from "../pages/Products/ProductsPage";
import ProductDetailsPage from "../pages/Products/ProductDetailsPage";
import OrderDetailsPage from "../pages/Orders/OrderDetailsPage";
import CreateProductPage from "../pages/Products/CreateProductPage";
import EditProductPage from "../pages/Products/EditProductPage";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";

import FarmerPortalPage from "../pages/Farmer/FarmerPortalPage";
import FarmerDashboardPage from "../pages/Farmer/FarmerDashboardPage";
import FarmerProfilePage from "../pages/Farmer/FarmerProfilePage";
import CartPage from "../pages/Cart/CartPage";
import ProtectedRoute from "./ProtectedRoute";
import FarmerRoute from "./FarmerRoute";
import NotificationsPage from "../pages/Notifications/NotificationsPage";

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

      /*
      ======================================
      TRANSITIONAL SELLER ENTRY
      ======================================

      The existing farmer portal is retained
      temporarily while the seller/business
      workspace is being migrated.
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

  These routes are retained so existing links
  to the former buyer/farmer authentication
  URLs continue to work.

  They now lead to the single AgricWise
  authentication experience.
  */

  {
    path: "/login/buyer",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/register/buyer",
    element: <Navigate to="/register" replace />,
  },

  {
    path: "/login/farmer",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/register/farmer",
    element: <Navigate to="/register" replace />,
  },

  /*
  ==========================================
  AUTHENTICATED USERS
  ==========================================
  */

  {
    element: <ProtectedRoute />,

    children: [
      /*
      ======================================
      TRANSITIONAL SELLER WORKSPACE
      ======================================

      These routes remain temporarily because
      the existing Product/Order models still
      use FarmerProfile as the seller capability.

      They will later evolve into the broader
      AgricWise Seller & Business Workspace.
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
    ],
  },

  /*
  ==========================================
  FALLBACK
  ==========================================
  */

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);