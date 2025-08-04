// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ErrorPage from "./pages/ErrorPage";
import CommunityPage from "./pages/CommunityPage";
import CampaignPage from "./pages/CampaignPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import ProfilePage from "./pages/ProfilePage";

import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "campaigns/:id",
        element: <CampaignDetailPage />,
      },
      {
        path: "admin",
        element: <AdminDashboardPage />,
      },
      {
        path: "admin/create-campaign",
        element: <CreateCampaignPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "campaigns",
        element: <CampaignPage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
      // Add other protected routes here
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "*",
        element: <Navigate to="/auth/signin" replace />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);
