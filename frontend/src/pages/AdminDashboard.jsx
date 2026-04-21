import { useState, useEffect } from 'react';
import { Users, ShoppingCart, DollarSign, Package, ArrowUpRight, ArrowDownRight, MoreVertical, Calendar, CheckCircle2, AlertCircle, Zap, LineChart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

// Enhanced StatCard Component with gradient and advanced styling
const StatCard = ({ icon: Icon, title, value, trend, trendUp, color, bgColor, delay = 0 }) => (
  <div className={`group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${delay}ms` }}>
    {/* Gradient background */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${bgColor}`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-4 ${bgColor} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg backdrop-blur-sm ${
          trendUp
            ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/50'
            : trendUp === false
            ? 'bg-red-50/80 text-red-700 border border-red-200/50'
            : 'bg-gray-50/80 text-gray-700 border border-gray-200/50'
        }`}>
          {trendUp === true ? <ArrowUpRight className="w-4 h-4" /> : trendUp === false ? <ArrowDownRight className="w-4 h-4" /> : null}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
        <p className="text-4xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  </div>
);

// Skeleton Loading Component
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
      <div className="w-16 h-6 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="space-y-2">
      <div className="w-24 h-4 bg-gray-200 rounded"></div>
      <div className="w-16 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Enhanced Chart Component with hover tooltip
const ChartBar = ({ day, value, max, accent }) => (
  <div className="flex flex-col items-center gap-2 group">
    <span className="text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{value}K</span>
    <div className="w-full bg-gradient-to-t from-gray-100 to-gray-50 rounded-xl overflow-hidden h-28 flex items-end justify-center p-1.5 group-hover:bg-gray-50 transition-colors">
      <div
        className={`w-3/4 rounded-t-lg transition-all duration-300 group-hover:shadow-lg ${accent} hover:opacity-90`}
        style={{ height: `${(value / max) * 100}%` }}
      />
    </div>
    <span className="text-xs font-bold text-gray-700">{day}</span>
  </div>
);

// Enhanced Activity Item Component
const ActivityItem = ({ icon: Icon, title, description, time, color, bgColor }) => (
  <div className="group flex items-start gap-4 py-4 px-4 -mx-4 rounded-xl hover:bg-gray-50/50 transition-colors duration-200 last:border-0">
    <div className={`p-3 ${bgColor} rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      <p className="text-xs text-gray-400 mt-2">{time}</p>
    </div>
    <div className="text-gray-300 group-hover:text-gray-400 flex-shrink-0">
      <ArrowUpRight className="w-4 h-4" />
    </div>
  </div>
);

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalCommandes: 0,
    totalClients: 0,
    totalProduits: 0,
    totalRevenue: 0,
    recentCommandes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      // Simulate fetching data from multiple endpoints
      const [commandes, users, produits] = await Promise.all([
        axios.get(`${API_URL}/commandes`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/users`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/produits`).catch(() => ({ data: [] })),
      ]);

      const totalRevenue = (commandes.data || []).reduce((sum, cmd) => sum + (cmd.montantTotal || 0), 0);
      const recentCommandes = (commandes.data || []).slice(0, 5);

      setStats({
        totalCommandes: (commandes.data || []).length,
        totalClients: (users.data || []).filter(u => u.role === 'client').length,
        totalProduits: (produits.data || []).length,
        totalRevenue,
        recentCommandes,
      });
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, trendUp, color, bgColor }) => (
    <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${
          trendUp 
            ? 'bg-emerald-50 text-emerald-700' 
            : trendUp === false
            ? 'bg-red-50 text-red-700'
            : 'bg-gray-50 text-gray-700'
        }`}>
          {trendUp === true ? <ArrowUpRight className="w-3.5 h-3.5" /> : trendUp === false ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue dans votre espace administratif</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium w-fit">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              icon={ShoppingCart}
              title="Commandes Totales"
              value={stats.totalCommandes}
              trend="+12.5%"
              trendUp={true}
              color="text-blue-600"
              bgColor="bg-blue-50"
              delay={100}
            />
            <StatCard
              icon={Users}
              title="Clients Actifs"
              value={stats.totalClients}
              trend="+8.2%"
              trendUp={true}
              color="text-emerald-600"
              bgColor="bg-emerald-50"
              delay={200}
            />
            <StatCard
              icon={Package}
              title="Produits"
              value={stats.totalProduits}
              trend="+4.3%"
              trendUp={true}
              color="text-amber-600"
              bgColor="bg-amber-50"
              delay={300}
            />
            <StatCard
              icon={DollarSign}
              title="Revenus"
              value={`${stats.totalRevenue.toFixed(0)}€`}
              trend="+18.9%"
              trendUp={true}
              color="text-purple-600"
              bgColor="bg-purple-50"
              delay={400}
            />
          </>
        )}
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ventes</h2>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <LineChart className="w-4 h-4" />
                Performance des 7 derniers jours
              </p>
            </div>
            <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-end justify-around gap-2 h-48 bg-gradient-to-b from-gray-50/50 to-transparent rounded-2xl px-4 py-6">
            {[
              { day: 'Lun', value: 45 },
              { day: 'Mar', value: 52 },
              { day: 'Mer', value: 68 },
              { day: 'Jeu', value: 58 },
              { day: 'Ven', value: 82 },
              { day: 'Sam', value: 91 },
              { day: 'Dim', value: 73 },
            ].map((item, i) => (
              <ChartBar key={i} day={item.day} value={item.value} max={100} accent="bg-gradient-to-t from-emerald-500 to-emerald-400" />
            ))}
          </div>
        </div>

        {/* Stats Summary Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Taux de Conversion</h3>
            <div className="space-y-5">
              {[
                { label: 'Converties', value: 68, color: 'bg-gradient-to-r from-emerald-500 to-emerald-400' },
                { label: 'En attente', value: 24, color: 'bg-gradient-to-r from-amber-500 to-amber-400' },
                { label: 'Annulées', value: 8, color: 'bg-gradient-to-r from-red-500 to-red-400' },
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500 group-hover:shadow-lg`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/30 rounded-2xl border border-emerald-200/60 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Performance Excellente</p>
                <p className="text-xs text-emerald-700 mt-2">📈 +23% vs dernière semaine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Activity & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Activité Récente</h2>
              <p className="text-sm text-gray-500 mt-1">Mises à jour en temps réel</p>
            </div>
            <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <ActivityItem
              icon={ShoppingCart}
              title="Nouvelle commande"
              description="Client a passé une nouvelle commande"
              time="Il y a 2 minutes"
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <ActivityItem
              icon={CheckCircle2}
              title="Commande livrée"
              description="Commande #2847 a été livrée avec succès"
              time="Il y a 15 minutes"
              color="text-emerald-600"
              bgColor="bg-emerald-50"
            />
            <ActivityItem
              icon={AlertCircle}
              title="Stock faible"
              description="5 produits ont un stock inférieur à 10 unités"
              time="Il y a 1 heure"
              color="text-amber-600"
              bgColor="bg-amber-50"
            />
            <ActivityItem
              icon={Users}
              title="Nouvel utilisateur"
              description="Un nouveau client s'est inscrit"
              time="Il y a 3 heures"
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Statistiques Clés</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-600">Panier Moyen</span>
                <span className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">127€</span>
              </div>
              <div className="h-px bg-gradient-to-r from-gray-100 to-transparent"></div>
              <div className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-600">Taux de Conversion</span>
                <span className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">3.2%</span>
              </div>
              <div className="h-px bg-gradient-to-r from-gray-100 to-transparent"></div>
              <div className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-600">Délai Moyen</span>
                <span className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">2.4j</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Status Commandes</h3>
            <div className="space-y-4">
              {[
                { label: 'Livré', count: 847, color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
                { label: 'En cours', count: 234, color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
                { label: 'En attente', count: 89, color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.dot}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Commandes Récentes</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        ) : stats.recentCommandes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-900 font-semibold mb-2">Aucune commande récente</p>
            <p className="text-gray-500 text-sm">Les nouvelles commandes apparaîtront ici automatiquement</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Commande</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCommandes.map((commande, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{commande.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{commande.client?.nom || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{commande.montantTotal || 0}€</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${
                        commande.estatut === 'Livrée' ? 'bg-emerald-50 text-emerald-700' :
                        commande.estatut === 'En attente' ? 'bg-amber-50 text-amber-700' :
                        commande.estatut === 'Validée' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          commande.estatut === 'Livrée' ? 'bg-emerald-600' :
                          commande.estatut === 'En attente' ? 'bg-amber-600' :
                          commande.estatut === 'Validée' ? 'bg-blue-600' :
                          'bg-gray-600'
                        }`}></span>
                        {commande.estatut || 'Inconnu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(commande.dateCommande).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}