import { Bell, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  const { user, organization } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
      <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
        <Search size={18} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search proposals, clients..."
          className="w-64 border-none bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="text-slate-500 hover:text-slate-800">
          <Bell size={22} />
        </button>

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="text-xs text-slate-500">
            {organization?.name}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
          {user?.firstName?.charAt(0)}
        </div>
      </div>
    </header>
  );
}