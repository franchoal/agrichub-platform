import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

/* =========================================================
   PUBLIC / CORE PAGES
========================================================= */

import HomePage from "../pages/Home/HomePage";
import AboutPage from "../pages/About/AboutPage";
import LandingPage from "../pages/Landing/LandingPage";

/* =========================================================
   AGRICULTURAL BUSINESS DISCOVERY
========================================================= */

import AgriculturalBusinessesPage from "../pages/Businesses/AgriculturalBusinessesPage";
import AgriculturalBusinessDetailsPage from "../pages/Businesses/AgriculturalBusinessDetailsPage";

/* =========================================================
   MARKETPLACE
========================================================= */

import ProductsPage from "../pages/Products/ProductsPage";
import ProductDetailsPage from "../pages/Products/ProductDetailsPage";
import CreateProductPage from "../pages/Products/CreateProductPage";
import EditProductPage from "../pages/Products/EditProductPage";

/* =========================================================
   SHOPPING
========================================================= */

import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";

/* =========================================================
   ORDERS
========================================================= */

import OrdersPage from "../pages/Orders/OrdersPage";
import OrderDetailsPage from "../pages/Orders/OrderDetailsPage";

/* =========================================================
   AUTHENTICATION
========================================================= */

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";

/* =========================================================
   FARMER / AGRICULTURAL BUSINESS WORKSPACE
========================================================= */

import FarmerPortalPage from "../pages/Farmer/FarmerPortalPage";
import FarmerDashboardPage from "../pages/Farmer/FarmerDashboardPage";
import FarmerOrdersPage from "../pages/Farmer/FarmerOrdersPage";
import FarmerOrderDetailsPage from "../pages/Farmer/FarmerOrderDetailsPage";
import FarmerProfilePage from "../pages/Farmer/FarmerProfilePage";

/* =========================================================
   NOTIFICATIONS
========================================================= */

import NotificationsPage from "../pages/Notifications/NotificationsPage";

/* =========================================================
   COMMUNITY
========================================================= */

import CreatePostPage from "../pages/Community/CreatePostPage";

/* =========================================================
   PERSONAL PROFILE
========================================================= */

import ProfilePage from "../pages/Profile/ProfilePage";

/* =========================================================
   ROUTE GUARDS
========================================================= */

import ProtectedRoute from "./ProtectedRoute";
import FarmerRoute from "./FarmerRoute";

/* =========================================================
   AUTH STORE
========================================================= */

import { useAuthStore } from "../store/authStore";


/*
==========================================
HOME ENTRY
==========================================

The root entry point serves two different
experiences depending on authentication.

Unauthenticated visitors see the public
AgricWise landing page.

Authenticated users proceed directly to
the existing AgricWise community feed.

This keeps the existing authenticated
experience intact while giving new visitors
a proper introduction to the platform.
*/

const HomeEntry = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (!isAuthenticated) {
    return <LandingPage />;
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
agricultural business / seller workspace.

FarmerProfilePage deliberately remains
outside FarmerRoute because a normal
authenticated user must be able to create
their first agricultural business profile.

Public agricultural business discovery also
remains outside ProtectedRoute so visitors
can discover businesses before registration.
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
      ROOT / COMMUNITY HOME
      ========================================

      Unauthenticated:
        LandingPage

      Authenticated:
        HomePage
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
      AGRICULTURAL BUSINESS DISCOVERY
      ========================================

      These pages are intentionally public.

      AgricWise business presence is part of
      the platform's discovery layer. Visitors
      should be able to discover agricultural
      businesses, products and services without
      being forced to register first.

      /businesses
        Business directory

      /businesses/:identifier
        Public business presence

      :identifier supports both:

        Numeric legacy ID
        Human-readable business slug

      The business details page resolves the
      identifier through the backend and
      canonicalizes legacy numeric URLs to
      the business slug.
      ========================================
      */

      {
        path: "businesses",
        element: <AgriculturalBusinessesPage />,
      },

      {
        path: "businesses/:identifier",
        element: <AgriculturalBusinessDetailsPage />,
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
      temporarily for compatibility.

      The underlying concept is now the
      AgricWise agricultural business workspace.
      ========================================
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
          AGRICULTURAL BUSINESS PROFILE
          ====================================

          This is intentionally outside
          FarmerRoute.

          A normal authenticated user must
          be able to create their agricultural
          business profile before accessing
          the business workspace.
          ====================================
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
          AGRICWISE BUSINESS WORKSPACE
          ====================================

          These routes require an existing
          FarmerProfile.

          FarmerRoute does not represent a
          permanent user account type.

          It only verifies that the user has
          an agricultural business / professional
          profile and can therefore access the
          business workspace.
          ====================================
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