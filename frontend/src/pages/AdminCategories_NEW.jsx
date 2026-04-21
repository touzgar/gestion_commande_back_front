import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X, Tag, FolderOpen, ImagePlus, Upload, Check, Sparkles } from 'lucide-react';
import { categorieService, uploadService } from '../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '', image: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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
    } catch (e) { console.error('Error:', e); }
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
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingCategory(null); setImagePreview(null); };

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
      setFormData(prev => ({ ...prev, image: response.data.url }));
      setImagePreview(response.data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error?.response?.data?.message || 'Erreur lors de l\'upload');
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
          <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-slate-400">Chargement des catégories...</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-500/30 rounded-xl">
              <Tag className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Catégories</h1>
          </div>
          <p className="text-slate-400 mt-1">Gérez les catégories de produits et leurs illustrations.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 border border-emerald-400/30 flex items-center gap-2 backdrop-blur-xl"
        >
          <Plus className="w-5 h-5" />
          Nouvelle catégorie
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, idx) => (
          <div
            key={category.id}
            className={`bg-gradient-to-br ${colors[idx % colors.length]} backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg`}
          >
            {category.image && (
              <div className="h-48 overflow-hidden relative">
                <img src={category.image} alt={category.nom} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
              </div>
            )}
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                {category.nom}
              </h3>
              {category.description && (
                <p className="text-sm text-slate-300 line-clamp-2">{category.description}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-emerald-500/20">
                <button
                  onClick={() => openModal(category)}
                  className="flex-1 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold rounded-lg transition-colors border border-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold rounded-lg transition-colors border border-red-500/30 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in backdrop-blur-xl">
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
                <p className="text-xs text-emerald-300 font-medium">{editingCategory ? 'Mise à jour des informations' : 'Création d\'une collection'}</p>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500"
                  placeholder="Ex: Électronique, Vêtements..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <FolderOpen className="w-4 h-4 text-emerald-400" />
                  Description <span className="text-slate-500 font-normal">(Optionnelle)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/60 transition-all text-white placeholder:text-slate-500 min-h-[90px] resize-none"
                  placeholder="Une brève description..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <ImagePlus className="w-4 h-4 text-emerald-400" />
                  Image d'illustration
                </label>
                <div className="flex flex-col gap-4">
                  {imagePreview ? (
                    <div className="flex items-end gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-emerald-500/30">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setFormData(p => ({ ...p, image: '' })); setImagePreview(null); }}
                        className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30"
                      >
                        Supprimer l'image
                      </button>
                    </div>
                  ) : (
                    <label className={`
                      flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200
                      ${uploadingImage ? 'border-emerald-400 bg-emerald-500/10' : 'border-emerald-500/30 bg-slate-800/30 hover:bg-slate-800/50 hover:border-emerald-400/60'}
                    `}>
                      <Upload className={`w-8 h-8 mb-3 ${uploadingImage ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
                      <p className="text-sm font-medium text-slate-300">
                        {uploadingImage ? 'Téléchargement...' : 'Cliquez pour ajouter une image'}
                      </p>
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-bold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-400/30 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2" disabled={uploadingImage}>
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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
