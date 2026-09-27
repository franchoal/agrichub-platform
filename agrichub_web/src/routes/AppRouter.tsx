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


/*
==========================================
AGRICWISE ROUTER
==========================================

MainLayout is the common application shell.

ProtectedRoute controls authentication.

FarmerRoute controls access to the existing
farmer/seller workspace.

FarmerProfilePage deliberately remains
outside FarmerRoute because a normal
authenticated user must be able to create
their first FarmerProfile.
*/

export const router = createBrowserRouter([
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
  MAIN AGRICWISE APPLICATION
  ==========================================
  */

  {
    path: "/",
    element: <MainLayout />,

    children: [

      /*
      ========================================
      COMMUNITY HOME
      ========================================
      */

      {
        index: true,
        element: <HomeEntry />,
      },


      /*
      ========================================
      PUBLIC INFORMATION
      ========================================
      */

      {
        path: "about",
        element: <AboutPage />,
      },


      /*
      ========================================
      MARKETPLACE
      ========================================
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
      ========================================
      TRANSITIONAL FARMER ENTRY
      ========================================

      Existing farmer portal is retained
      temporarily.
      */

      {
        path: "farmer",
        element: <FarmerPortalPage />,
      },


      /*
      ========================================
      AUTHENTICATED AGRICWISE USERS
      ========================================
      */

      {
        element: <ProtectedRoute />,

        children: [

          /*
          ====================================
          UNIVERSAL PERSONAL PROFILE
          ====================================
          */

          {
            path: "profile",
            element: <ProfilePage />,
          },


          /*
          ====================================
          COMMUNITY POST CREATION
          ====================================
          */

          {
            path: "community/create",
            element: <CreatePostPage />,
          },


          /*
          ====================================
          FARMER PROFILE ONBOARDING
          ====================================

          IMPORTANT:

          This is intentionally outside
          FarmerRoute.

          A normal authenticated user must
          be able to create their FarmerProfile
          before accessing the farmer workspace.
          */

          {
            path: "farmer/profile",
            element: <FarmerProfilePage />,
          },


          /*
          ====================================
          SHOPPING
          ====================================
          */

          {
            path: "cart",
            element: <CartPage />,
          },

          {
            path: "checkout",
            element: <CheckoutPage />,
          },


          /*
          ====================================
          ORDERS
          ====================================
          */

          {
            path: "orders",
            element: <OrdersPage />,
          },

          {
            path: "orders/:id",
            element: <OrderDetailsPage />,
          },


          /*
          ====================================
          NOTIFICATIONS
          ====================================
          */

          {
            path: "notifications",
            element: <NotificationsPage />,
          },


          /*
          ====================================
          FARMER / SELLER WORKSPACE
          ====================================

          These routes require an existing
          FarmerProfile.

          FarmerRoute does not represent a
          permanent user account type.
          It only verifies that the user's
          seller/farmer capability exists.
          */

          {
            element: <FarmerRoute />,

            children: [

              {
                path: "farmer/dashboard",
                element: <FarmerDashboardPage />,
              },

              {
                path: "farmer/orders",
                element: <FarmerOrdersPage />,
              },

              {
                path: "farmer/orders/:id",
                element: <FarmerOrderDetailsPage />,
              },

              {
                path: "farmer/products/create",
                element: <CreateProductPage />,
              },

              {
                path: "farmer/products/:id/edit",
                element: <EditProductPage />,
              },

            ],
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