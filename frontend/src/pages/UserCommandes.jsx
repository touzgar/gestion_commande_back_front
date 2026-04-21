import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Package, CheckCircle, Eye, Loader2, X } from 'lucide-react';
import { commandeService } from '../services/api';

const statutColors = {
  'En attente': 'bg-amber-500/10 text-amber-400',
  'Validée': 'bg-blue-500/10 text-blue-400',
  'Livrée': 'bg-emerald-500/10 text-emerald-400',
  'Annulée': 'bg-red-500/10 text-red-400',
};

export default function UserCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommande, setSelectedCommande] = useState(null);

  useEffect(() => { loadCommandes(); }, []);

  const loadCommandes = async () => {
    try { const r = await commandeService.getMyOrders(); setCommandes(r.data); }
    catch (e) { console.error('Error:', e); }
    finally { setLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const filteredCommandes = commandes.filter((c) => c.id.toString().includes(searchTerm));

  if (loading) return (<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>);

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Mes Commandes</h1>
        <p>Suivez l'état de vos commandes.</p>
      </header>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Rechercher par numéro..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field !pl-10" />
          </div>
        </div>

        {filteredCommandes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium mb-1">Aucune commande trouvée</p>
            <p className="text-sm text-slate-500 mb-6">Commencez par passer une commande</p>
            <Link to="/user/produits" className="btn-primary text-sm">Passer une commande</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCommandes.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    c.statut === 'Livrée' ? 'bg-emerald-500/10' : c.statut === 'Validée' ? 'bg-blue-500/10' : 'bg-amber-500/10'
                  }`}>
                    {c.statut === 'Livrée' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                     c.statut === 'Validée' ? <Package className="w-5 h-5 text-blue-400" /> :
                     <Clock className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Commande <span className="text-indigo-400">#{c.id}</span></p>
                    <p className="text-xs text-slate-500">{c.lignes?.length} article(s) • {formatDate(c.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statutColors[c.statut] || 'bg-slate-500/10 text-slate-400'}`}>
                    {c.statut}
                  </span>
                  <p className="font-bold text-sm text-white">{Number(c.montant_total).toFixed(2)} €</p>
                  <button onClick={() => setSelectedCommande(c)} className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCommande && (
        <div className="modal-overlay" onClick={() => setSelectedCommande(null)}>
          <div className="modal-content card max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Commande <span className="text-indigo-400">#{selectedCommande.id}</span></h3>
                <p className="text-xs text-slate-500 mt-1">{formatDate(selectedCommande.date)}</p>
              </div>
              <button onClick={() => setSelectedCommande(null)} className="p-2 hover:bg-white/[0.05] rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <span className="text-sm text-slate-400">Statut</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statutColors[selectedCommande.statut]}`}>{selectedCommande.statut}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Articles</p>
                <div className="space-y-2">
                  {selectedCommande.lignes?.map((l, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 w-8 h-8 rounded-lg flex items-center justify-center">{l.quantite}x</span>
                        <span className="text-sm text-white font-medium">{l.produit?.nom}</span>
                      </div>
                      <span className="text-sm text-white font-semibold">{(l.quantite * Number(l.prix_unitaire)).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-white/[0.06] pt-4 flex justify-between items-center">
                <span className="text-slate-400 font-medium">Total</span>
                <span className="text-xl font-black text-indigo-400">{Number(selectedCommande.montant_total).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}