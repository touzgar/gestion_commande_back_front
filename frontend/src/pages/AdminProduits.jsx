import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Box, ImagePlus, Upload, Check, Filter, ShoppingCart, AlertCircle, TrendingUp } from 'lucide-react';
import { produitService, categorieService, uploadService } from '../services/api';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} border border-white/20 shadow-sm hover:shadow-md transition-shadow duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white/70 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {subtext && <p className="text-xs text-white/60 mt-2">{subtext}</p>}
      </div>
      <div className="p-3 bg-white/20 rounded-xl">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);
  const [formData, setFormData] = useState({ nom: '', prix: '', stock: '', description: '', categorieId: '', image: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');

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
    } catch (error) { console.error('Error saving produit:', error); alert('Erreur lors de la sauvegarde'); }
  };

  const deleteProduit = async (id) => {
    if (confirm('�tes-vous s�r de vouloir supprimer ce produit?')) {
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
    setUploadError('');
    setShowPanel(true);
  };

  const closePanel = () => { setShowPanel(false); setEditingProduit(null); setImagePreview(null); setUploadError(''); };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    setUploadError('');
    try {
      if (file.size > 5242880) {
        setUploadError('Fichier trop volumineux (max 5MB)');
        setUploadingImage(false);
        return;
      }
      
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
      setUploadError('');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Erreur lors de l\'upload image';
      setUploadError(errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredProduits = produits.filter((p) => {
    const matchSearch = p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || p.categorie?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = !filterCategorie || p.categorie?.id === parseInt(filterCategorie);
    return matchSearch && matchCategorie;
  });

  const totalValue = produits.reduce((sum, p) => sum + (p.prix * p.stock), 0);
  const lowStockCount = produits.filter(p => p.stock < 5).length;
  const avgPrice = produits.length > 0 ? (produits.reduce((sum, p) => sum + p.prix, 0) / produits.length).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-slate-500">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Produits</h1>
          <p className="text-slate-500 mt-1">Gérez votre catalogue de {produits.length} produit{produits.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => openPanel()} className="btn-primary !py-2.5 !px-4 flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={ShoppingCart} 
          label="Total de produits" 
          value={produits.length}
          color="from-emerald-500 to-emerald-600"
          subtext="Dans le catalogue"
        />
        <StatCard 
          icon={AlertCircle} 
          label="Stock faible" 
          value={lowStockCount}
          color="from-amber-500 to-amber-600"
          subtext="Moins de 5 unités"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Valeur inventaire" 
          value={`€${totalValue.toFixed(2)}`}
          color="from-blue-500 to-blue-600"
          subtext="Valeur totale"
        />
        <StatCard 
          icon={Box} 
          label="Prix moyen" 
          value={`€${avgPrice}`}
          color="from-purple-500 to-purple-600"
          subtext="Par produit"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400" 
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredProduits.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Box className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun produit trouv�</h3>
            <p className="text-slate-500 text-sm">Ajustez votre recherche ou ajoutez un nouveau produit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Produit</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cat�gorie</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Prix</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProduits.map((produit) => (
                  <tr key={produit.id} className="group hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent transition-all duration-300">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative group/img">
                          {produit.image ? (
                            <img src={produit.image} alt={produit.nom} className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-sm group-hover/img:shadow-md group-hover/img:scale-105 transition-all duration-300" />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border border-slate-200 group-hover/img:border-emerald-300 transition-colors">
                              <Box className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{produit.nom}</p>
                          <p className="text-xs text-slate-500 mt-1">ID: {produit.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 border border-blue-200 group-hover:from-blue-100 group-hover:to-blue-50/50 transition-all">
                        {produit.categorie?.nom || 'Sans catégorie'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        <span className="text-xs text-slate-500">€</span> {Number(produit.prix).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        produit.stock > 10 ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 border-emerald-200 group-hover:from-emerald-100'
                          : produit.stock > 0 ? 'bg-gradient-to-r from-amber-50 to-amber-50/50 text-amber-700 border-amber-200 group-hover:from-amber-100'
                          : 'bg-gradient-to-r from-red-50 to-red-50/50 text-red-700 border-red-200 group-hover:from-red-100'
                      }`}>
                        {produit.stock} unit{produit.stock !== 1 ? 'és' : 'é'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openPanel(produit)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteProduit(produit.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Supprimer">
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

      {/* Slide Panel / Modal */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closePanel} />
          <div className="relative w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{editingProduit ? 'Modifier le produit' : 'Nouveau produit'}</h2>
                <p className="text-sm text-slate-500">{editingProduit ? 'Mettez � jour les informations' : 'Cr�ez un nouveau produit dans votre catalogue'}</p>
              </div>
              <button onClick={closePanel} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
              {/* Nom Section */}
              <div className="space-y-3 p-4 bg-gradient-to-br from-emerald-50 to-emerald-50/30 rounded-2xl border border-emerald-100">
                <label className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Informations produit</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Nom du produit</label>
                    <input 
                      type="text" 
                      value={formData.nom} 
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
                      className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-slate-900 font-medium" 
                      placeholder="Ex: Smartphone XYZ" 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Prix (€)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={formData.prix} 
                        onChange={(e) => setFormData({ ...formData, prix: e.target.value })} 
                        className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-slate-900 font-medium" 
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Stock</label>
                      <input 
                        type="number" 
                        value={formData.stock} 
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                        className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-slate-900 font-medium" 
                        placeholder="0" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Section */}
              <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-blue-50/30 rounded-2xl border border-blue-100">
                <label className="text-xs font-bold uppercase text-blue-700 tracking-wider">Classification</label>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Catégorie</label>
                  <select 
                    value={formData.categorieId} 
                    onChange={(e) => setFormData({ ...formData, categorieId: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-slate-900 font-medium" 
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-purple-50/30 rounded-2xl border border-purple-100">
                <label className="text-xs font-bold uppercase text-purple-700 tracking-wider">Détails</label>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all text-slate-900 font-medium min-h-[80px] resize-none" 
                    placeholder="Description détaillée du produit..." 
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-3 p-4 bg-gradient-to-br from-amber-50 to-amber-50/30 rounded-2xl border border-amber-100">
                <label className="text-xs font-bold uppercase text-amber-700 tracking-wider">Illustration</label>
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {imagePreview && (
                    <div className="relative group">
                      <div className="w-full h-32 rounded-xl overflow-hidden border-2 border-amber-200 shadow-sm">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { setFormData({ ...formData, image: '' }); setImagePreview(null); setUploadError(''); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className={`
                    flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                    ${uploadingImage ? 'border-emerald-400 bg-emerald-50' : uploadError ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-white hover:bg-amber-50 hover:border-amber-400'}
                  `}>
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className={`w-6 h-6 mb-2 ${uploadingImage ? 'text-emerald-500 animate-bounce' : uploadError ? 'text-red-400' : 'text-amber-500'}`} />
                      <p className="text-xs font-bold text-slate-700">
                        {uploadingImage ? 'Téléchargement...' : uploadError ? 'Erreur' : 'Cliquer pour ajouter'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                  </label>
                </div>
              </div>

              <div className="sticky bottom-0 -mx-6 -mb-6 bg-gradient-to-t from-white via-white to-white/80 border-t border-slate-200 p-4 flex items-center justify-end gap-3 z-10 backdrop-blur-sm">
                <button type="button" onClick={closePanel} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 disabled:opacity-60" disabled={uploadingImage}>
                  {uploadingImage ? <Upload className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingProduit ? 'Sauvegarder' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
