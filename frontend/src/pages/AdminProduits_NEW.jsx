import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Loader2, X, Box, ImagePlus, Upload, Check, ChevronRight, Tag, Euro, Package, FileText } from 'lucide-react';
import { produitService, categorieService, uploadService } from '../services/api';

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);
  const [formData, setFormData] = useState({ nom: '', prix: '', stock: '', description: '', categorieId: '', image: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [produitsRes, categoriesRes] = await Promise.all([produitService.getAll(), categorieService.getAll()]);
      setProduits(produitsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) { console.error('Error loading data:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, prix: parseFloat(formData.prix), stock: parseInt(formData.stock), categorieId: formData.categorieId ? parseInt(formData.categorieId) : null };
      if (editingProduit) { await produitService.update(editingProduit.id, data); }
      else { await produitService.create(data); }
      loadData(); closePanel();
    } catch (error) { console.error('Error saving produit:', error); }
  };

  const deleteProduit = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try { await produitService.delete(id); loadData(); }
      catch (error) { console.error('Error deleting produit:', error); }
    }
  };

  const openPanel = (produit = null) => {
    if (produit) {
      setEditingProduit(produit);
      setFormData({ nom: produit.nom, prix: String(produit.prix), stock: String(produit.stock), description: produit.description || '', categorieId: String(produit.categorie?.id || ''), image: produit.image || '' });
      setImagePreview(produit.image || null);
    } else {
      setEditingProduit(null);
      setFormData({ nom: '', prix: '', stock: '', description: '', categorieId: '', image: '' });
      setImagePreview(null);
    }
    setShowPanel(true);
  };

  const closePanel = () => { setShowPanel(false); setEditingProduit(null); setImagePreview(null); };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await uploadService.uploadImage({
        fileName: file.name,
        mimeType: file.type,
        fileBase64: base64,
      });

      setFormData((prev) => ({ ...prev, image: response.data.url }));
      setImagePreview(response.data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error?.response?.data?.message || 'Erreur lors de l\'upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredProduits = produits.filter((p) =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || p.categorie?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-slate-300">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Produits</h1>
          <p className="text-slate-400 mt-2">Gérez votre inventaire et vos articles de vente.</p>
        </div>
        <button onClick={() => openPanel()} className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau Produit</span>
        </button>
      </header>

      <div className="relative bg-slate-800/50 backdrop-blur-md rounded-2xl border border-emerald-500/20 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
        <div className="relative z-10 p-6 border-b border-emerald-500/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, SKU..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-800/40 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {filteredProduits.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Box className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Aucun produit</h3>
            <p className="text-slate-400 text-sm mb-6">Commencez par ajouter vos premiers produits à votre boutique.</p>
            <button onClick={() => openPanel()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-colors">
              Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-emerald-500/10">
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-left">Image</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-left">Nom</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-left">Catégorie</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Prix</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {filteredProduits.map((produit) => (
                  <tr key={produit.id} className="hover:bg-emerald-500/10 transition-colors group">
                    <td className="px-6 py-4">
                      {produit.image ? (
                        <img src={produit.image} alt={produit.nom} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                          <Box className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{produit.nom}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/30">{produit.categorie?.nom || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-bold text-white">{Number(produit.prix).toFixed(2)} €</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className={`font-bold ${produit.stock > 10 ? 'text-emerald-400' : produit.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>{produit.stock}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openPanel(produit)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteProduit(produit.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-in Panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={closePanel} />
          <div className="relative w-full sm:max-w-lg bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-700/10 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white">{editingProduit ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={closePanel} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-white">
                  <Box className="w-4 h-4 text-emerald-400" />
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500"
                  placeholder="Ex: Chaise ergonomique..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-white">
                    <Euro className="w-4 h-4 text-emerald-400" />
                    Prix
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-white">
                    <Package className="w-4 h-4 text-emerald-400" />
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-white">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  Catégorie
                </label>
                <select
                  value={formData.categorieId}
                  onChange={(e) => setFormData({ ...formData, categorieId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-white">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500 min-h-[100px] resize-none"
                  placeholder="Description détaillée..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-white">
                  <ImagePlus className="w-4 h-4 text-emerald-400" />
                  Image du produit
                </label>
                <div className="flex flex-col gap-4">
                  {imagePreview ? (
                    <div className="flex items-end gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-emerald-500/30 shrink-0">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setFormData(p => ({ ...p, image: '' })); setImagePreview(null); }}
                        className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/30"
                      >
                        Supprimer l'image
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploadingImage ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-emerald-500/30 bg-slate-800/30 hover:bg-slate-800/50 hover:border-emerald-400/60'}`}>
                      <Upload className={`w-8 h-8 mb-3 ${uploadingImage ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
                      <p className="text-sm font-medium text-slate-300">
                        {uploadingImage ? 'Téléchargement...' : 'Cliquez pour ajouter une image'}
                      </p>
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-500/10 flex items-center justify-end gap-3">
                <button type="button" onClick={closePanel} className="px-4 py-2.5 text-sm font-bold text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all border border-emerald-500/20">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 rounded-xl transition-all flex items-center gap-2" disabled={uploadingImage}>
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingProduit ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
