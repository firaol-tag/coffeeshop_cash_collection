import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-coffee-espresso text-coffee-paper shadow-cup'
      : 'text-coffee-roast hover:bg-coffee-foam/90 hover:text-coffee-espresso'
  }`;

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-coffee-latte/80 bg-coffee-paper/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-semibold text-coffee-espresso tracking-tight">
              House Blend
            </span>
            <span className="text-coffee-crema text-xs font-semibold uppercase tracking-widest hidden sm:inline px-2 py-0.5 rounded-md bg-coffee-foam border border-coffee-latte/60">
              POS
            </span>
          </div>
          <nav className="flex flex-wrap gap-1 items-center">
            <NavLink to="/" className={linkClass} end>
              POS
            </NavLink>
            <NavLink to="/credits" className={linkClass}>
              Credit
            </NavLink>
            <NavLink to="/menu" className={linkClass}>
              Menu
            </NavLink>
            {isAdmin && (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Reports
                </NavLink>
                <NavLink to="/users" className={linkClass}>
                  Users
                </NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-coffee-mocha">
              {user?.name}
              <span className="text-coffee-steam"> · {user?.role}</span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="text-coffee-caramel font-medium hover:text-coffee-crema transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
