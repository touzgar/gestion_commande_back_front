import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Box,
  CreditCard,
  Loader2,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { commandeService } from '../services/api';

const paiementOptions = [
  { value: 'Paiement à la livraison', label: 'Paiement à la livraison', icon: Wallet },
  { value: 'Carte bancaire', label: 'Carte bancaire', icon: CreditCard },
  { value: 'Virement', label: 'Virement', icon: CreditCard },
];

const livraisonOptions = [
  { value: 'Standard', label: 'Standard (48-72h)' },
  { value: 'Express', label: 'Express (24h)' },
  { value: 'Point relais', label: 'Point relais' },
];

export default function UserPanier() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal, getItemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    modePaiement: paiementOptions[0].value,
    methodeLivraison: livraisonOptions[0].value,
    notes: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      nom: user.nom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      adresse: user.adresse || '',
    }));
  }, [user]);

  const handleCommander = async () => {
    if (!user) { navigate('/login'); return; }
    if (!form.telephone || !form.adresse) {
      alert('Veuillez remplir téléphone et adresse avant de confirmer.');
      return;
    }

    setLoading(true);
    try {
      const lignes = cart.map((item) => ({ produitId: item.produit.id, quantite: item.quantite }));
      await commandeService.create({
        userId: user.id,
        lignes,
        modePaiement: form.modePaiement,
        methodeLivraison: form.methodeLivraison,
        adresseLivraison: form.adresse,
        telephoneLivraison: form.telephone,
        notes: form.notes,
      });
      clearCart();
      navigate('/user/commandes');
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-800/50 flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Votre panier est vide</h2>
        <p className="text-slate-400 mb-8 text-sm">Ajoutez des produits pour commencer votre checkout</p>
        <Link to="/user/produits" className="btn-primary">Découvrir les produits</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Checkout & Paiement</h1>
        <p>{getItemCount()} article(s) dans votre commande</p>
      </header>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="card">
            <h3 className="text-base font-bold text-white mb-4">Informations client</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Nom</label>
                <input 
                  className="input-field" 
                  value={form.nom} 
                  onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
                  disabled={!!user} 
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Email</label>
                <input 
                  className="input-field" 
                  value={form.email} 
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={!!user} 
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Téléphone</label>
                <input className="input-field" value={form.telephone} onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))} placeholder="+216 ..." />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Adresse livraison</label>
                <input className="input-field" value={form.adresse} onChange={(e) => setForm((prev) => ({ ...prev, adresse: e.target.value }))} placeholder="Adresse complète" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-slate-300 mb-2">Notes (optionnel)</label>
              <textarea className="input-field min-h-[90px]" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Instructions de livraison, etc." />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="card">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-indigo-400" /> Paiement</h3>
              <div className="space-y-2">
                {paiementOptions.map((option) => {
                  const Icon = option.icon;
                  const active = form.modePaiement === option.value;
                  return (
                    <button type="button" key={option.value} onClick={() => setForm((prev) => ({ ...prev, modePaiement: option.value }))} className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${active ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' : 'border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.04]'}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-400" /> Livraison</h3>
              <div className="space-y-2">
                {livraisonOptions.map((option) => {
                  const active = form.methodeLivraison === option.value;
                  return (
                    <button type="button" key={option.value} onClick={() => setForm((prev) => ({ ...prev, methodeLivraison: option.value }))} className={`w-full p-3 rounded-xl border text-left transition-colors ${active ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.04]'}`}>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-base font-bold text-white mb-4">Produits dans la commande</h3>
            <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.produit.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800/50 flex items-center justify-center">
                {item.produit.image ? (
                  <img src={item.produit.image} alt={item.produit.nom} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{item.produit.nom}</p>
                <p className="text-xs text-slate-500">{Number(item.produit.prix).toFixed(2)} € / unité</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateQuantity(item.produit.id, item.quantite - 1)} className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-sm">{item.quantite}</span>
                <button onClick={() => updateQuantity(item.produit.id, item.quantite + 1)} className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.produit.id)} className="text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                Retirer
              </button>
            </div>
          ))}
            </div>
          </div>
        </div>

        <div className="xl:sticky xl:top-6 h-fit">
          <div className="card">
            <h3 className="text-base font-bold text-white mb-5">Résumé de commande</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Sous-total</span>
                <span className="text-white font-medium">{getTotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Livraison ({form.methodeLivraison})</span>
                <span className="text-emerald-400 font-medium">Incluse</span>
              </div>
              <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="text-xl font-black text-indigo-400">{getTotal().toFixed(2)} €</span>
              </div>
            </div>
            <button onClick={handleCommander} disabled={loading} className="btn-primary w-full !py-3">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />{form.modePaiement === 'Paiement à la livraison' ? 'Traitement en cours...' : 'Paiement en cours...'}</>
              ) : (
                <>{form.modePaiement === 'Paiement à la livraison' ? 'Confirmer la commande' : 'Confirmer & Payer'}<ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Paiement sécurisé
            </div>
            <button onClick={clearCart} className="w-full text-center text-slate-500 text-xs mt-3 hover:text-red-400 transition-colors">
              Vider le panier
            </button>
          </div>

          <div className="mt-4 card bg-indigo-500/[0.08] border-indigo-500/20">
            <p className="text-sm text-indigo-300 flex items-center gap-2">
              <Box className="w-4 h-4" />
              Mode paiement: <strong>{form.modePaiement}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}