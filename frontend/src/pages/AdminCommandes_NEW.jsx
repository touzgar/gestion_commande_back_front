import { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Loader2, Package, Clock, Truck, Ban, ListOrdered, ChevronRight } from 'lucide-react';
import { commandeService } from '../services/api';

const statutConfig = {
  'En attente': {
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Clock,
    label: 'En attente',
  },
  'Validée': {
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Check,
    label: 'Validée',
  },
  'Livrée': {
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Truck,
    label: 'Livrée',
  },
  'Annulée': {
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: Ban,
    label: 'Annulée',
  },
};

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCommandes = commandes.filter((c) =>
    c.id.toString().includes(searchTerm) || c.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-slate-400">Chargement des commandes...</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-500/30 rounded-xl">
              <ListOrdered className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Commandes</h1>
          </div>
          <p className="text-slate-400 mt-1">Gérez les commandes, suivez les expéditions et les paiements.</p>
        </div>
      </header>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-transparent">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par ID ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {filteredCommandes.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Aucune commande</h3>
            <p className="text-slate-400 text-sm">Il n'y a aucune commande correspondant à votre recherche.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-emerald-500/20">
                  <th className="py-4 px-6 text-xs font-bold text-emerald-300 uppercase tracking-wider">Commande</th>
                  <th className="py-4 px-6 text-xs font-bold text-emerald-300 uppercase tracking-wider">Client</th>
                  <th className="py-4 px-6 text-xs font-bold text-emerald-300 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-emerald-300 uppercase tracking-wider">Montant</th>
                  <th className="py-4 px-6 text-xs font-bold text-emerald-300 uppercase tracking-wider">Statut</th>
                  <th className="py-4 px-6 text-xs font-bold text-emerald-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommandes.map((commande, idx) => (
                  <tr key={commande.id} className={`border-b border-emerald-500/10 transition-colors ${idx % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/10'} hover:bg-slate-800/40`}>
                    <td className="py-4 px-6 text-sm font-bold text-white">#{commande.id}</td>
                    <td className="py-4 px-6 text-sm text-slate-300">{commande.user?.nom || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm text-slate-400">{formatDate(commande.dateCreation)}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-emerald-300">{commande.montantTotal?.toFixed(2)} €</td>
                    <td className="py-4 px-6">
                      <select
                        value={commande.statut}
                        onChange={(e) => updateStatut(commande.id, e.target.value)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all bg-opacity-20 backdrop-blur cursor-pointer ${statutConfig[commande.statut]?.color || 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}
                      >
                        {Object.entries(statutConfig).map(([key, val]) => (
                          <option key={key} value={key} className="bg-slate-900 text-white">{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <button
                        onClick={() => setSelectedCommande(commande)}
                        className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold rounded-lg transition-colors border border-emerald-500/30 inline-flex items-center gap-2"
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

      {selectedCommande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCommande(null)} />
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in backdrop-blur-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between sticky top-0">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">Commande #{selectedCommande.id}</h2>
                  <p className="text-xs text-emerald-300 font-medium">{formatDate(selectedCommande.dateCreation)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCommande(null)} className="p-2 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/30 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold mb-1">CLIENT</p>
                  <p className="text-white font-bold">{selectedCommande.user?.nom || 'N/A'}</p>
                  <p className="text-sm text-slate-400">{selectedCommande.user?.email || 'N/A'}</p>
                </div>
                <div className="bg-slate-800/30 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold mb-1">MONTANT TOTAL</p>
                  <p className="text-xl font-extrabold text-emerald-300">{selectedCommande.montantTotal?.toFixed(2)} €</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Articles</h3>
                {selectedCommande.ligneCommandes?.map((ligne) => (
                  <div key={ligne.id} className="bg-slate-800/30 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{ligne.produit?.nom || 'Produit'}</p>
                      <p className="text-sm text-slate-400">{ligne.quantite} × {ligne.prixUnitaire?.toFixed(2)} €</p>
                    </div>
                    <p className="text-emerald-300 font-bold">{(ligne.quantite * ligne.prixUnitaire)?.toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-2">LIVRAISON</p>
                <div className="text-white space-y-1">
                  <p className="text-sm">{selectedCommande.livraison?.adresse || 'Non spécifiée'}</p>
                  <p className="text-emerald-300 font-semibold mt-2">{selectedCommande.livraison?.transporteur?.nom || 'Transporteur'} - {selectedCommande.livraison?.dateEstimee ? formatDate(selectedCommande.livraison?.dateEstimee) : 'Date à confirmer'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
