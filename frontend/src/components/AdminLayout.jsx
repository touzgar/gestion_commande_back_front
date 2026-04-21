import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home,
  Users,
  ShoppingCart,
  Package,
  Tag,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/admin/dashboard', icon: Home, label: 'Tableau de bord' },
  { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { path: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { path: '/admin/produits', icon: Package, label: 'Produits' },
  { path: '/admin/categories', icon: Tag, label: 'Catégories' },
];

export default function AdminLayout() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200/80 transform lg:translate-x-0 transition-all duration-300 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all">
              A
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900">Admin Hub</h1>
              <p className="text-xs text-gray-500 font-medium">v1.0</p>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 shadow-sm border border-emerald-200/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent'}
                `}
              >
                <Icon className={`w-4.5 h-4.5 transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-50/50 border border-gray-100 rounded-lg">
            <p className="text-xs text-gray-500 font-semibold mb-1">UTILISATEUR</p>
            <p className="text-sm font-bold text-gray-900 truncate">{user?.nom || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200/50 rounded-lg text-red-700 hover:bg-red-100 hover:border-red-300 transition-all font-medium text-sm group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-4 lg:px-8 flex items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-1 max-w-sm group focus-within:bg-white focus-within:border-emerald-300 transition-all">
              <Search className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500 font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full shadow-sm"></span>
              <span className="absolute inset-0 rounded-lg bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="relative group">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.nom?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-gray-900">{user?.nom || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all" />
              </button>
              
              {userDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">{user?.nom || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}