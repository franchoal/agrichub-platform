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

import { useAuthStore } from "../store/authStore";


/*
==========================================
HOME ENTRY
==========================================

The AgricWise community feed is for
authenticated members.

A new visitor must first create an
AgricWise account.

Returning authenticated users proceed
directly to the community feed.
*/

const HomeEntry = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/register"
        replace
      />
    );
  }

  return <HomePage />;
};


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
      /*
      ======================================
      COMMUNITY HOME / FEED
      ======================================
      */

      {
        index: true,
        element: <HomeEntry />,
      },

      /*
      ======================================
      PUBLIC INFORMATION
      ======================================
      */

      {
        path: "about",
        element: <AboutPage />,
      },

      /*
      ======================================
      MARKETPLACE
      ======================================
      */

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

      The broader AgricWise architecture does
      not treat Farmer as a permanent account
      type.
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

  FarmerProfile onboarding is also outside
  FarmerRoute because a user must be able to
  CREATE a FarmerProfile before they can enter
  the seller workspace.
  */

  {
    element: <ProtectedRoute />,

    children: [

      /*
      ======================================
      UNIVERSAL PERSONAL PROFILE
      ======================================
      */

      {
        path: "/profile",
        element: <ProfilePage />,
      },


      /*
      ======================================
      FARMER/SELLER ONBOARDING
      ======================================

      This route is available to any
      authenticated AgricWise user.

      It creates the FarmerProfile capability
      required by the existing marketplace
      Product model.

      It is intentionally NOT protected by
      FarmerRoute because FarmerRoute requires
      the FarmerProfile to already exist.
      */

      {
        path: "/farmer/profile",
        element: <FarmerProfilePage />,
      },


      /*
      ======================================
      COMMUNITY PARTICIPATION
      ======================================
      */

      {
        path: "/community/create",
        element: <CreatePostPage />,
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

      These routes remain protected by
      FarmerRoute because they require an
      existing FarmerProfile.

      FarmerRoute does NOT define the user's
      identity. It only verifies that the
      agricultural seller capability exists.
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