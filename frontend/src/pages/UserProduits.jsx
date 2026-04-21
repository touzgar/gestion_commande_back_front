import { useState, useEffect } from 'react';
import { Search, Loader2, ShoppingCart, Box, Sparkles } from 'lucide-react';
import { produitService, categorieService } from '../services/api';
import { useCart } from '../context/CartContext';

export default function UserProduits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [produitsRes, categoriesRes] = await Promise.all([
        produitService.getAll(),
        categorieService.getAll(),
      ]);
      setProduits(produitsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (produit) => {
    addToCart(produit);
    setAddedId(produit.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const filteredProduits = produits.filter((produit) => {
    const matchesSearch = produit.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || produit.categorie?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm text-slate-500">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Nos Produits</h1>
        <p>Découvrez notre catalogue de produits.</p>
      </header>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !pl-10 w-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                !selectedCategory
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:border-white/[0.1] hover:text-white'
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:border-white/[0.1] hover:text-white'
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProduits.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">Aucun produit trouvé</p>
          <p className="text-sm text-slate-500 mt-1">Essayez un autre terme de recherche</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProduits.map((produit) => (
            <div
              key={produit.id}
              className="group relative bg-slate-900/30 backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500/25 transition-all duration-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/[0.04]"
            >
              <div className="p-5">
                {/* Product image placeholder */}
                <div className="aspect-square bg-gradient-to-br from-slate-800/60 to-slate-800/30 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-violet-500/[0.03]" />
                  {produit.image ? (
                    <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
                  ) : (
                    <Box className="w-10 h-10 text-slate-600 group-hover:text-slate-500 transition-colors" />
                  )}
                </div>

                <h3 className="font-bold text-sm text-white mb-1 truncate">{produit.nom}</h3>
                <p className="text-xs text-slate-500 mb-3">
                  {produit.categorie?.nom || 'Sans catégorie'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-black text-indigo-400">
                    {Number(produit.prix).toFixed(2)} €
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-lg uppercase tracking-wider ${
                      produit.stock > 10
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : produit.stock > 0
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {produit.stock > 0 ? `${produit.stock} en stock` : 'Rupture'}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(produit)}
                  disabled={produit.stock <= 0}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    addedId === produit.id
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : produit.stock > 0
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40'
                      : 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-white/[0.04]'
                  }`}
                >
                  {addedId === produit.id ? (
                    <>
                      <Sparkles size={16} />
                      Ajouté!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Ajouter au panier
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}