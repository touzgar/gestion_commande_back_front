import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, ChevronUp, ChevronDown, Shield, Users, Zap, X, Filter, Eye, Building, Briefcase, PieChart, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'client',
    telephone: '',
    adresse: '',
    profession: '',
    entreprise: '',
    poste: '',
    secteur: '',
    experience: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
  const [filters, setFilters] = useState({
    role: '',
    profession: '',
    entreprise: '',
    secteur: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, formData);
      setFormData({
        nom: '',
        email: '',
        password: '',
        role: 'client',
        telephone: '',
        adresse: '',
        profession: '',
        entreprise: '',
        poste: '',
        secteur: '',
        experience: ''
      });
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEditRole = async (userId, newRole) => {
    try {
      await axios.patch(`${API_URL}/users/${userId}`, { role: newRole });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.entreprise?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesProfession = !filters.profession || user.profession?.toLowerCase().includes(filters.profession.toLowerCase());
      const matchesEntreprise = !filters.entreprise || user.entreprise?.toLowerCase().includes(filters.entreprise.toLowerCase());
      const matchesSecteur = !filters.secteur || user.secteur?.toLowerCase().includes(filters.secteur.toLowerCase());

      return matchesSearch && matchesRole && matchesProfession && matchesEntreprise && matchesSecteur;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const roles = ['client', 'manager', 'admin'];

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const clearFilters = () => {
    setFilters({ role: '', profession: '', entreprise: '', secteur: '' });
    setSearchTerm('');
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-500 mt-2">Gérez les rôles et permissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          Ajouter Utilisateur
        </button>
      </div>

      {/* Stats Cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Utilisateurs</p>
          <p className="text-4xl font-bold text-gray-900">{users.length}</p>
          <p className="text-xs text-gray-500 mt-3">Tous les comptes</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Administrateurs</p>
          <p className="text-4xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
          <p className="text-xs text-gray-500 mt-3">Accès complet</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Clients Actifs</p>
          <p className="text-4xl font-bold text-gray-900">{users.filter(u => u.role === 'client').length}</p>
          <p className="text-xs text-gray-500 mt-3">Utilisateurs réguliers</p>
        </div>
      </div>

      {/* User Distribution Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-emerald-600" />
              Répartition des Utilisateurs
            </h2>
            <p className="text-sm text-gray-500 mt-1">Distribution par rôle</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Total: {users.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { role: 'client', label: 'Clients', count: users.filter(u => u.role === 'client').length, color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
            { role: 'manager', label: 'Managers', count: users.filter(u => u.role === 'manager').length, color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
            { role: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
          ].map((item) => (
            <div key={item.role} className={`p-6 rounded-2xl ${item.bg} border border-gray-100 hover:shadow-md transition-all group cursor-pointer`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-lg">{item.count}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${item.text}`}>{item.label}</p>
                  <p className="text-xs text-gray-500">
                    {users.length > 0 ? Math.round((item.count / users.length) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${users.length > 0 ? (item.count / users.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar & Filters - Enhanced */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-300 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, profession ou entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-500 font-medium"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-all ${showFilters ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="client">Client</option>
            </select>
            <input
              type="text"
              placeholder="Profession"
              value={filters.profession}
              onChange={(e) => setFilters({...filters, profession: e.target.value})}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Entreprise"
              value={filters.entreprise}
              onChange={(e) => setFilters({...filters, entreprise: e.target.value})}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Secteur"
                value={filters.secteur}
                onChange={(e) => setFilters({...filters, secteur: e.target.value})}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table - Enhanced */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 font-medium">Chargement...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun utilisateur trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <th className="px-8 py-5 text-left">
                    <button
                      onClick={() => handleSort('nom')}
                      className="flex items-center gap-2 font-bold text-gray-900 text-sm hover:text-emerald-600 transition-colors uppercase tracking-wider"
                    >
                      Nom
                      {sortConfig.key === 'nom' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-8 py-5 text-left">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-2 font-bold text-gray-900 text-sm hover:text-emerald-600 transition-colors uppercase tracking-wider"
                    >
                      Email
                      {sortConfig.key === 'email' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-8 py-5 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">Profession</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">Entreprise</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">Rôle</th>
                  <th className="px-8 py-5 text-center font-bold text-gray-900 text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-white transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                          user.role === 'admin' ? 'bg-red-500' :
                          user.role === 'manager' ? 'bg-blue-500' :
                          'bg-emerald-500'
                        } group-hover:scale-110 transition-transform`}>
                          {user.nom?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.nom}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-gray-700 font-medium">{user.email}</p>
                      {user.telephone && <p className="text-xs text-gray-500">{user.telephone}</p>}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 text-sm">{user.profession || 'N/A'}</span>
                      </div>
                      {user.poste && <p className="text-xs text-gray-500 mt-1">{user.poste}</p>}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 text-sm">{user.entreprise || 'N/A'}</span>
                      </div>
                      {user.secteur && <p className="text-xs text-gray-500 mt-1">{user.secteur}</p>}
                    </td>
                    <td className="px-8 py-5">
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="px-3 py-2 border-2 border-emerald-300 rounded-xl bg-white text-gray-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {roles.map(role => (
                              <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleEditRole(user.id, editRole)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm font-bold"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold inline-block shadow-sm border ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700 border-red-200' :
                          user.role === 'manager' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                          {user.role === 'admin' ? '👑 Admin' :
                           user.role === 'manager' ? '💼 Manager' :
                           '👤 Client'}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Voir profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {editingId === user.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(user.id);
                                setEditRole(user.role);
                              }}
                              className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${
                    selectedUser.role === 'admin' ? 'bg-red-500' :
                    selectedUser.role === 'manager' ? 'bg-blue-500' :
                    'bg-emerald-500'
                  }`}>
                    {selectedUser.nom?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedUser.nom}</h2>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mt-2 ${
                      selectedUser.role === 'admin' ? 'bg-red-100 text-red-700' :
                      selectedUser.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedUser.role === 'admin' ? '👑 Admin' :
                       selectedUser.role === 'manager' ? '💼 Manager' :
                       '👤 Client'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Informations Personnelles
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">{selectedUser.telephone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adresse:</span>
                      <span className="font-medium text-right">{selectedUser.adresse || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'inscription:</span>
                      <span className="font-medium">
                        {selectedUser.dateInscription ? new Date(selectedUser.dateInscription).toLocaleDateString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Informations Professionnelles
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profession:</span>
                      <span className="font-medium">{selectedUser.profession || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Poste:</span>
                      <span className="font-medium">{selectedUser.poste || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entreprise:</span>
                      <span className="font-medium">{selectedUser.entreprise || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Secteur:</span>
                      <span className="font-medium">{selectedUser.secteur || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expérience (ans):</span>
                      <span className="font-medium">{selectedUser.experience || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser.commandes && selectedUser.commandes.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Historique des Commandes</h3>
                  <div className="space-y-2">
                    {selectedUser.commandes.slice(0, 5).map((cmd) => (
                      <div key={cmd.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Commande #{cmd.id}</span>
                        <span className="text-gray-600">{cmd.montantTotal}€</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un Utilisateur</h2>
            <form onSubmit={handleAddUser} className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nom complet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="+33 6 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Adresse</label>
                <textarea
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="Adresse complète"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Profession</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({...formData, profession: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Développeur, Designer..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Poste</label>
                  <input
                    type="text"
                    value={formData.poste}
                    onChange={(e) => setFormData({...formData, poste: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Senior, Junior..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Entreprise</label>
                  <input
                    type="text"
                    value={formData.entreprise}
                    onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Secteur</label>
                  <input
                    type="text"
                    value={formData.secteur}
                    onChange={(e) => setFormData({...formData, secteur: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Tech, Finance..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Expérience (ans)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
