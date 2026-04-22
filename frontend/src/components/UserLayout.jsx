import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Package, 
  LayoutDashboard, 
  ShoppingCart, 
  ShoppingBag,
  LogOut,
  Menu,
  ChevronRight,
  Bell,
  Search,
  User,
  Heart,
  Moon,
  Sun
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const menuItems = [
  { path: '/user/dashboard', icon: LayoutDashboard, label: 'Mon Dashboard' },
  { path: '/user/produits', icon: ShoppingBag, label: 'Boutique' },
  { path: '/user/commandes', icon: ShoppingCart, label: 'Mes Commandes' },
];

export default function UserLayout() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { getItemCount } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6">
            <Link to="/user/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                <Package size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Packedia</h2>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Espace Client</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu</p>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-slate-900 transition-colors'} />
                  <span className="font-bold text-sm flex-1">{item.label}</span>
                  {isActive ? (
                    <ChevronRight size={14} className="text-white opacity-50" />
                  ) : (
                    item.path === '/user/commandes' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )
                  )}
                </Link>
              );
            })}

            <div className="my-6 border-t border-slate-100 mx-4"></div>
            
            <Link
              to="/user/checkout"
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${location.pathname === '/user/checkout' 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {getItemCount() > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border-2 ${
                    location.pathname === '/user/checkout' ? 'bg-white text-emerald-600 border-emerald-600' : 'bg-emerald-500 text-white border-white'
                  }`}>
                    {getItemCount()}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm flex-1">Mon Panier</span>
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-sm">
                      {user?.nom?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.nom}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase truncate">Client Premium</p>
                    </div>
                  </div>
                  <button 
                    onClick={logout} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all text-xs font-bold"
                  >
                    <LogOut size={14} />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-bold"
                >
                  <User size={14} />
                  <span>Se connecter</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className={`
          sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 transition-all duration-200
          ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'}
        `}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 lg:hidden shadow-sm active:scale-95 transition-transform"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 w-80 focus-within:w-96 focus-within:bg-white focus-within:border-emerald-300 transition-all duration-300 group">
              <Search size={18} className="text-slate-400 group-focus-within:text-emerald-500" />
              <input 
                type="text" 
                placeholder="Rechercher un produit..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/user/checkout" className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors relative group">
              <ShoppingCart size={20} />
              {getItemCount() > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 text-white border-2 border-white rounded-full text-[8px] font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getItemCount()}
                </span>
              )}
            </Link>
            
            <button className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} />
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 pl-1">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-900">{user ? user.nom : 'Invité'}</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">{user ? 'Mon Compte' : 'Non connecté'}</p>
              </div>
              <Link to={user ? "/user/dashboard" : "/login"} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                <User size={18} />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}