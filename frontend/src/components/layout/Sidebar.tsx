import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Clients",
    icon: Users,
    path: "/clients",
  },
  {
    title: "Products",
    icon: Package,
    path: "/products",
  },
  {
    title: "Proposals",
    icon: FileText,
    path: "/proposals",
  },
  {
    title: "Organization",
    icon: Building2,
    path: "/organization",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const { organization, logout } = useAuth();

  return (
    <aside className="hidden w-64 flex-col bg-slate-900 text-white md:flex">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-xl font-bold">ProposalFlow</h2>

        <p className="mt-2 text-sm text-slate-400">
          {organization?.name}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="m-4 flex items-center gap-3 rounded-lg border border-slate-700 px-4 py-3 text-slate-300 transition hover:bg-red-600 hover:text-white"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}