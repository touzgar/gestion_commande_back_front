import { useState, useEffect } from 'react';
import { Search, Eye, Filter, TrendingUp, ShoppingCart, ArrowUpRight, Clock, Truck, Package, X } from 'lucide-react';
import { commandeService } from '../services/api';

const statutConfig = {
  'En attente': {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock,
    badge: '⏳ En attente',
  },
  'Validée': {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: ShoppingCart,
    badge: '✓ Validée',
  },
  'Livrée': {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Truck,
    badge: '✓ Livrée',
  },
  'Annulée': {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: X,
    badge: '✗ Annulée',
  },
};

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [selectedCommande, setSelectedCommande] = useState(null);

  useEffect(() => { loadCommandes(); }, []);

  const loadCommandes = async () => {
    try { const r = await commandeService.getAll(); setCommandes(r.data); }
    catch (e) { console.error('Error:', e); }
    finally { setLoading(false); }
  };

  const updateStatut = async (id, statut) => {
    try { await commandeService.updateStatut(id, statut); loadCommandes(); }
    catch (e) { console.error('Error:', e); }
  };

  const filteredCommandes = commandes.filter((c) => {
    const matchesSearch = c.id.toString().includes(searchTerm) || c.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatut || c.statut === filterStatut;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR');
  
  const stats = {
    total: commandes.length,
    delivered: commandes.filter(c => c.statut === 'Livrée').length,
    pending: commandes.filter(c => c.statut === 'En attente').length,
    revenue: commandes.reduce((sum, c) => sum + (c.montantTotal || 0), 0),
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-500 mt-2">Suivez vos commandes et expéditions</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-emerald-700">{stats.revenue.toFixed(0)}€ CA</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all group">
          <div className="p-3 bg-blue-50 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Commandes</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all group">
          <div className="p-3 bg-emerald-50 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <Truck className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Livrées</p>
          <p className="text-3xl font-bold text-gray-900">{stats.delivered}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all group">
          <div className="p-3 bg-amber-50 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">En Attente</p>
          <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-50/30 rounded-2xl border border-purple-200/60 p-6 shadow-sm hover:shadow-lg transition-all group">
          <div className="p-3 bg-purple-100 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Revenu Total</p>
          <p className="text-3xl font-bold text-purple-900">{(stats.revenue / 1000).toFixed(1)}K€</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-300 focus-within:bg-white transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-500 font-medium"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 font-medium cursor-pointer"
            >
              <option value="">Tous les statuts</option>
              {Object.keys(statutConfig).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Commandes Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
        {filteredCommandes.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune commande</h3>
            <p className="text-gray-600">Aucune commande ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Commande</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Client</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Montant</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Statut</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommandes.map((commande) => (
                  <tr key={commande.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-white transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">#{commande.id}</td>
                    <td className="px-8 py-5 text-sm text-gray-600">{commande.user?.nom || 'N/A'}</td>
                    <td className="px-8 py-5 text-sm text-gray-600">{formatDate(commande.dateCreation)}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">{commande.montantTotal?.toFixed(2)} €</td>
                    <td className="px-8 py-5">
                      <select
                        value={commande.statut}
                        onChange={(e) => updateStatut(commande.id, e.target.value)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${statutConfig[commande.statut]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                      >
                        {Object.keys(statutConfig).map((key) => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button
                        onClick={() => setSelectedCommande(commande)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors inline-flex items-center gap-2 text-sm font-bold shadow-sm group-hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedCommande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6 flex items-center justify-between sticky top-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Commande #{selectedCommande.id}</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">{formatDate(selectedCommande.dateCreation)}</p>
              </div>
              <button onClick={() => setSelectedCommande(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-600 font-semibold mb-2">CLIENT</p>
                  <p className="text-gray-900 font-bold">{selectedCommande.user?.nom || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedCommande.user?.email || 'N/A'}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-xs text-emerald-700 font-semibold mb-2">MONTANT TOTAL</p>
                  <p className="text-2xl font-bold text-emerald-700">{selectedCommande.montantTotal?.toFixed(2)} €</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Articles</h3>
                {selectedCommande.ligneCommandes?.map((ligne) => (
                  <div key={ligne.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-gray-900 font-semibold">{ligne.produit?.nom || 'Produit'}</p>
                      <p className="text-sm text-gray-600">{ligne.quantite} × {ligne.prixUnitaire?.toFixed(2)} €</p>
                    </div>
                    <p className="text-gray-900 font-bold">{(ligne.quantite * ligne.prixUnitaire)?.toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-700 font-semibold mb-2">LIVRAISON</p>
                <div className="text-gray-900 space-y-1">
                  <p className="text-sm">{selectedCommande.livraison?.adresse || 'Non spécifiée'}</p>
                  <p className="text-blue-700 font-semibold mt-2">{selectedCommande.livraison?.transporteur?.nom || 'Transporteur'} - {selectedCommande.livraison?.dateEstimee ? formatDate(selectedCommande.livraison?.dateEstimee) : 'Date à confirmer'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
