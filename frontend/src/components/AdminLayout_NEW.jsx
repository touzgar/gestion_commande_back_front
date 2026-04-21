import { useState } from 'react';
import { Menu, X, LogOut, Home, Package, ShoppingCart, Tag, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { label: 'Utilisateurs', icon: Users, path: '/admin/users' },
    { label: 'Produits', icon: Package, path: '/admin/produits' },
    { label: 'Catégories', icon: Tag, path: '/admin/categories' },
    { label: 'Commandes', icon: ShoppingCart, path: '/admin/commandes' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-screen shadow-sm z-40`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500 font-medium">Gestion Complète</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive(item.path)
                  ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-red-700 hover:bg-red-50 transition-all font-medium"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Espace Administrateur</h2>
              <p className="text-sm text-gray-500 mt-1">Gérez votre plateforme efficacement</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-semibold">
                Administrateur Actif
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
