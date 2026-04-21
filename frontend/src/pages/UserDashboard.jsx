import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  ShoppingBag,
  History,
  TrendingUp,
  Star,
  ChevronRight
} from 'lucide-react';
import { commandeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statutIcons = {
  'En attente': Clock,
  'Validée': CheckCircle,
  'Livrée': Package,
};

const statutColors = {
  'En attente': 'text-amber-500 bg-amber-50 border-amber-100',
  'Validée': 'text-blue-500 bg-blue-50 border-blue-100',
  'Livrée': 'text-emerald-500 bg-emerald-50 border-emerald-100',
};

export default function UserDashboard() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      const response = await commandeService.getMyOrders();
      setCommandes(response.data);
    } catch (error) {
      console.error('Error loading commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const totalSpent = commandes.reduce((sum, c) => sum + Number(c.montant_total), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Section */}
      <header className="relative overflow-hidden bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-sm tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Espace Client Packedia</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              Ravi de vous revoir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{user?.nom}</span> !
            </h1>
            <p className="text-slate-500 mt-2 text-lg max-w-xl">
              Suivez vos commandes en cours et découvrez nos dernières nouveautés.
            </p>
          </div>
          <Link 
            to="/user/produits" 
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Faire des achats</span>
          </Link>
        </div>
        
        {/* Abstract shapes for background decoration */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:rotate-12">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dépenses totales</p>
            <p className="text-2xl font-black text-slate-900">{totalSpent.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-violet-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center transition-transform group-hover:rotate-12">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Commandes passées</p>
            <p className="text-2xl font-black text-slate-900">{commandes.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:rotate-12">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Points fidélité</p>
            <p className="text-2xl font-black text-slate-900">{Math.floor(totalSpent / 10)} pts</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <History className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Commandes récentes</h3>
              </div>
              <Link to="/user/commandes" className="text-sm font-bold text-emerald-600 hover:underline inline-flex items-center">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {commandes.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-10 h-10 text-slate-200" />
                  </div>
                  <h4 className="text-slate-900 font-bold text-lg mb-2">Vous n'avez pas encore commandé</h4>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">Explorez notre catalogue pour trouver les meilleurs produits au meilleur prix.</p>
                  <Link to="/user/produits" className="btn-primary">
                    Découvrir nos produits
                  </Link>
                </div>
              ) : (
                commandes.slice(0, 5).map((commande) => {
                  const Icon = statutIcons[commande.statut] || Clock;
                  const colorClass = statutColors[commande.statut] || 'text-slate-500 bg-slate-50 border-slate-100';
                  return (
                    <div key={commande.id} className="p-6 hover:bg-slate-50 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Commande #{commande.id}</p>
                            <p className="text-xs text-slate-500 font-medium">
                              {commande.lignes?.length || 0} article(s) • {formatDate(commande.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <div className="text-right sm:text-right">
                            <p className="font-black text-slate-900">{Number(commande.montant_total).toFixed(2)} €</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
                              {commande.statut}
                            </span>
                          </div>
                          <Link 
                            to="/user/commandes" 
                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-200 group-hover:shadow-sm transition-all"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Active Promo Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 mb-4 inline-block">
                Offre exclusive
              </span>
              <h4 className="text-2xl font-black mb-2 leading-tight">Prêt pour votre prochain achat ?</h4>
              <p className="text-indigo-100 text-sm mb-6">
                -15% sur votre prochaine commande avec le code <span className="text-amber-300 font-black">PACK15</span>
              </p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors">
                Utiliser le coupon
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          {/* Quick Support */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Besoin d'aide ?</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <span className="text-sm font-medium text-slate-600">Suivi de livraison</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <span className="text-sm font-medium text-slate-600">Politique de retour</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <span className="text-sm font-medium text-slate-600">Contacter le support</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}