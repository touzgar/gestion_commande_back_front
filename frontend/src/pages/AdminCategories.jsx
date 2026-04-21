import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Tag, FolderOpen, ImagePlus, Upload, Check, Grid3X3, AlertCircle } from 'lucide-react';
import { categorieService, uploadService } from '../services/api';

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

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '', image: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try { const r = await categorieService.getAll(); setCategories(r.data); }
    catch (e) { console.error('Error:', e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) { await categorieService.update(editingCategory.id, formData); }
      else { await categorieService.create(formData); }
      loadCategories(); closeModal();
    } catch (e) { console.error('Error:', e); alert('Erreur lors de la sauvegarde'); }
  };

  const deleteCategory = async (id) => {
    if (confirm('Supprimer cette catégorie ?')) {
      try { await categorieService.delete(id); loadCategories(); }
      catch (e) { console.error('Error:', e); }
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ nom: category.nom, description: category.description || '', image: category.image || '' });
      setImagePreview(category.image || null);
    } else {
      setEditingCategory(null);
      setFormData({ nom: '', description: '', image: '' });
      setImagePreview(null);
    }
    setUploadError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingCategory(null); setImagePreview(null); setUploadError(''); };

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
      setFormData(prev => ({ ...prev, image: response.data.url }));
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

  const colors = [
    'from-emerald-500/20 to-emerald-400/10 border-emerald-500/30',
    'from-blue-500/20 to-blue-400/10 border-blue-500/30',
    'from-violet-500/20 to-violet-400/10 border-violet-500/30',
    'from-amber-500/20 to-amber-400/10 border-amber-500/30',
    'from-rose-500/20 to-rose-400/10 border-rose-500/30',
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-slate-500">Chargement des catégories...</p>
      </div>
    </div>
  );

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.produits?.length || 0), 0);
  const avgProductsPerCategory = categories.length > 0 ? (totalProducts / categories.length).toFixed(1) : 0;

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catégories</h1>
          <p className="text-slate-500 mt-1">Organisez vos {categories.length} catégorie{categories.length !== 1 ? 's' : ''} de produits</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary !py-2.5 !px-4 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Nouvelle catégorie
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={Grid3X3} 
          label="Total de catégories" 
          value={categories.length}
          color="from-emerald-500 to-emerald-600"
          subtext="Collections actives"
        />
        <StatCard 
          icon={FolderOpen} 
          label="Total de produits" 
          value={totalProducts}
          color="from-blue-500 to-blue-600"
          subtext="Tous les produits"
        />
        <StatCard 
          icon={Tag} 
          label="Moyenne par catégorie" 
          value={avgProductsPerCategory}
          color="from-purple-500 to-purple-600"
          subtext="Produits/catégorie"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Aucune cat�gorie</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Commencez par cr�er des cat�gories pour organiser vos produits et faciliter la navigation de vos clients.
              </p>
              <button onClick={() => openModal()} className="btn-primary mt-6 !py-2 !px-4 mx-auto block">
                Cr�er la premi�re
              </button>
            </div>
          </div>
        ) : (
          categories.map((cat, i) => (
            <div key={cat.id} className="group flex flex-col bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 rounded-2xl overflow-hidden transition-all duration-300">
              {/* Image Banner */}
              <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                {cat.image ? (
                  <div className="relative w-full h-full">
                    <img src={cat.image} alt={cat.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                    <FolderOpen className="w-12 h-12 text-white/40" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">{cat.nom}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {cat.produits?.length || 0} produit{cat.produits?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${i % 3 === 0 ? 'from-emerald-100 to-emerald-50 text-emerald-700' : i % 3 === 1 ? 'from-blue-100 to-blue-50 text-blue-700' : 'from-purple-100 to-purple-50 text-purple-700'}`}>
                    {cat.produits?.length || 0}
                  </div>
                </div>

                {cat.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3 flex-1">{cat.description}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-2 py-3 border-t border-b border-slate-100 mb-3">
                  <div className="text-center flex-1">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Actif</p>
                    <p className="text-sm font-bold text-emerald-600 mt-1">✓</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 p-4 bg-slate-50 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
                <button onClick={() => openModal(cat)} className="flex-1 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all flex items-center justify-center gap-1.5 border border-emerald-200">
                  <Edit className="w-3.5 h-3.5" />
                  Modifier
                </button>
                <button onClick={() => deleteCategory(cat.id)} className="flex-1 px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all flex items-center justify-center gap-1.5 border border-red-200">
                  <Trash2 className="w-3.5 h-3.5" />
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Ajout / Modification */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
                <p className="text-xs text-slate-500 font-medium">{editingCategory ? 'Mise à jour des informations' : 'Création d\'une collection'}</p>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-colors shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nom de la catégorie</label>
                <input 
                  type="text" 
                  value={formData.nom} 
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900" 
                  placeholder="Ex: Électronique, Vêtements..."
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description <span className="text-slate-400 font-normal">(Optionnelle)</span></label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 min-h-[90px] resize-none" 
                  placeholder="Une brève description..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Image d'illustration</label>
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    {uploadError}
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  {imagePreview ? (
                    <div className="flex items-end gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-slate-200 shrink-0">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { setFormData(p => ({ ...p, image: '' })); setImagePreview(null); }}
                        className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Supprimer l'image
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${uploadingImage ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-emerald-400'} ${uploadError ? 'border-red-300 bg-red-50' : ''}`}>
                      <Upload className={`w-8 h-8 mb-3 ${uploadingImage ? 'text-emerald-500 animate-bounce' : uploadError ? 'text-red-400' : 'text-slate-400'}`} />
                      <p className="text-sm font-medium text-slate-600">
                        {uploadingImage ? 'Téléchargement...' : uploadError ? 'Erreur de téléchargement' : 'Cliquez pour ajouter une image'}
                      </p>
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-200 flex items-center gap-2 disabled:opacity-60" disabled={uploadingImage}>
                  {uploadingImage ? <Upload className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingCategory ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
