
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import { CartProvider } from "react-use-cart";

import App from "./App";
import Login from "./Login/Login";
import Register from "./Login/Register";
import ForgotPassword from "./Login/Forgot";
import Menus from "./Menus/Menus";
import Cart from "./cart/Cart.jsx";
import SingleMenus from "./Menus/SingleMenus";
import Favorites from "./Favorites/Favorites";

import Dashboard from "./Admin/pages/Dashboard";
import Meals from "./Admin/pages/Meals";
import Categories from "./Admin/pages/Categories";

import { AllData } from "./data/AllData";
import { FavoritesProvider } from "./Favorites/FavoritesContext";

import "leaflet/dist/leaflet.css";

function isAdminAuthenticated() {
  try {
    const storedUser =
      sessionStorage.getItem("auth_user") ||
      localStorage.getItem("auth_user");

    if (!storedUser) {
      return false;
    }

    const user = JSON.parse(storedUser);

    const token =
      sessionStorage.getItem("auth_token") ||
      localStorage.getItem("auth_token");

    return Boolean(token && user?.role === "admin");
  } catch {
    return false;
  }
}

function AdminRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
      },
      {
        path: "/admin/meals",
        element: <Meals />,
      },
      {
        path: "/admin/categories",
        element: <Categories />,
      },
    ],
  },

  {
    path: "/menus",
    element: <Menus />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/singleMenus/:id",
    element: <SingleMenus />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AllData>
      <CartProvider>
        <FavoritesProvider>
          <RouterProvider router={router} />
        </FavoritesProvider>
      </CartProvider>
    </AllData>
  </React.StrictMode>
);
