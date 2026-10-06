import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import ProposalDetailsPage from "../features/proposals/pages/ProposalDetailsPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import LoginPage from "../features/auth/LoginPage";
import EditProposalPage from "../features/proposals/pages/EditProposalPage";
import ProposalsPage from "../features/proposals/ProposalsPage";
import CreateProposalPage from "../features/proposals/pages/CreateProposalPage";

function Placeholder({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex min-h-full items-center justify-center">
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== */}
        {/* PUBLIC ROUTES */}
        {/* ==================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={
            <Placeholder title="Register" />
          }
        />

        {/* ==================== */}
        {/* PROTECTED ROUTES */}
        {/* ==================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            {/* Clients */}
            <Route
              path="/clients"
              element={
                <Placeholder title="Clients" />
              }
            />

            {/* Products */}
            <Route
              path="/products"
              element={
                <Placeholder title="Products" />
              }
            />

            {/* Proposals */}
            <Route
              path="/proposals"
              element={<ProposalsPage />}
            />
<Route
  path="/proposals/:id"
  element={<ProposalDetailsPage />}
/>
<Route
  path="/proposals/:id/edit"
  element={<EditProposalPage />}
/>
            {/* Create Proposal */}
            <Route
              path="/proposals/new"
              element={<CreateProposalPage />}
            />

            {/* Organization */}
            <Route
              path="/organization"
              element={
                <Placeholder title="Organization" />
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <Placeholder title="Settings" />
              }
            />
          </Route>
        </Route>

        {/* ==================== */}
        {/* DEFAULT ROUTE */}
        {/* ==================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ==================== */}
        {/* 404 */}
        {/* ==================== */}

        <Route
          path="*"
          element={
            <Placeholder
              title="Page Not Found"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}