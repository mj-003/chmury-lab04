import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Music,
  Calendar,
  Tag,
  ExternalLink,
  BarChart3,
  Filter,
  X,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3001";

function AlbumManager() {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const [newAlbum, setNewAlbum] = useState({
    band: "",
    title: "",
    year: "",
    genre: "",
    cover: "",
  });

  useEffect(() => {
    fetchAlbums();
    fetchStats();
  }, []);

  useEffect(() => {
    filterAlbums();
  }, [albums, searchTerm, filterGenre]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/albums`);
      if (!response.ok) throw new Error("Błąd pobierania albumów");
      const data = await response.json();
      setAlbums(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Błąd pobierania statystyk:", err);
    }
  };

  const filterAlbums = () => {
    let filtered = albums;

    if (searchTerm) {
      filtered = filtered.filter(
        (album) =>
          album.band.toLowerCase().includes(searchTerm.toLowerCase()) ||
          album.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterGenre) {
      filtered = filtered.filter((album) =>
        album.genre.toLowerCase().includes(filterGenre.toLowerCase())
      );
    }

    setFilteredAlbums(filtered);
  };

  const addAlbum = async () => {
    if (!newAlbum.band || !newAlbum.title || !newAlbum.year) {
      setError("Wypełnij wszystkie wymagane pola");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/albums`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      await fetchAlbums();
      await fetchStats();
      setNewAlbum({ band: "", title: "", year: "", genre: "", cover: "" });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateAlbum = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/albums/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Błąd aktualizacji albumu");

      await fetchAlbums();
      await fetchStats();
      setEditingAlbum(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAlbum = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten album?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/albums/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Błąd usuwania albumu");

      await fetchAlbums();
      await fetchStats();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const genres = [...new Set(albums.map((album) => album.genre))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">Ładowanie albumów...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/3 rounded-full blur-2xl"></div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Music className="text-pink-400" size={48} />
            Menedżer Albumów
          </h1>
          <p className="text-xl text-purple-200">
            Zarządzaj swoją kolekcją muzyczną
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-slate-700/50 shadow-2xl">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Szukaj albumów lub zespołów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all shadow-lg"
              />
            </div>

            {/* Genre Filter */}
            <div className="relative">
              <Filter
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="pl-12 pr-8 py-3 bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none cursor-pointer shadow-lg"
              >
                <option value="">Wszystkie gatunki</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="text-black">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 backdrop-blur shadow-lg hover:shadow-xl"
              >
                <BarChart3 size={20} />
                {showStats ? "Ukryj" : "Statystyki"}
              </button>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Dodaj Album
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 backdrop-blur text-white p-4 rounded-2xl mb-6 border border-red-500/30 shadow-xl relative">
            <p className="text-center font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Stats Panel */}
        {showStats && stats && (
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-slate-700/50 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-blue-400" />
              Statystyki Kolekcji
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 rounded-2xl p-4 text-center border border-slate-600/30 hover:bg-slate-700/70 transition-all duration-300 shadow-lg">
                <div className="text-3xl font-bold text-pink-400">
                  {stats.totalAlbums}
                </div>
                <div className="text-slate-300">Albumów</div>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4 text-center border border-slate-600/30 hover:bg-slate-700/70 transition-all duration-300 shadow-lg">
                <div className="text-3xl font-bold text-purple-400">
                  {stats.bandCount}
                </div>
                <div className="text-slate-300">Zespołów</div>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4 text-center border border-slate-600/30 hover:bg-slate-700/70 transition-all duration-300 shadow-lg">
                <div className="text-3xl font-bold text-blue-400">
                  {stats.genreCount}
                </div>
                <div className="text-slate-300">Gatunków</div>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4 text-center border border-slate-600/30 hover:bg-slate-700/70 transition-all duration-300 shadow-lg">
                <div className="text-3xl font-bold text-green-400">
                  {Math.round(
                    albums.reduce((sum, a) => sum + a.year, 0) / albums.length
                  )}
                </div>
                <div className="text-slate-300">Śr. Rok</div>
              </div>
            </div>
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-slate-700/50 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="text-pink-400" />
              Dodaj Nowy Album
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nazwa zespołu *"
                value={newAlbum.band}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, band: e.target.value })
                }
                className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
              />
              <input
                type="text"
                placeholder="Tytuł albumu *"
                value={newAlbum.title}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, title: e.target.value })
                }
                className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
              />
              <input
                type="number"
                placeholder="Rok wydania *"
                value={newAlbum.year}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, year: e.target.value })
                }
                className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
              />
              <input
                type="text"
                placeholder="Gatunek"
                value={newAlbum.genre}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, genre: e.target.value })
                }
                className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
              />
              <input
                type="url"
                placeholder="URL okładki"
                value={newAlbum.cover}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, cover: e.target.value })
                }
                className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  onClick={addAlbum}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Dodaj Album
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 group shadow-xl hover:shadow-2xl"
            >
              {/* Album Cover */}
              <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-purple-600 relative shadow-lg">
                {album.cover &&
                album.cover !==
                  "https://via.placeholder.com/300x300?text=No+Cover" ? (
                  <img
                    src={album.cover}
                    alt={`${album.title} cover`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <Music size={64} className="opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink
                    className="text-white drop-shadow-lg"
                    size={32}
                  />
                </div>
              </div>

              {/* Album Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                  {album.title}
                </h3>
                <p className="text-purple-300 font-medium">{album.band}</p>

                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {album.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={16} />
                    {album.genre}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => setEditingAlbum(album)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Edit size={16} />
                  Edytuj
                </button>
                <button
                  onClick={() => deleteAlbum(album.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Trash2 size={16} />
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAlbums.length === 0 && !loading && (
          <div className="text-center py-12">
            <Music className="mx-auto text-slate-500 mb-4" size={64} />
            <p className="text-slate-400 text-xl">
              {searchTerm || filterGenre
                ? "Nie znaleziono albumów spełniających kryteria"
                : "Brak albumów w kolekcji"}
            </p>
          </div>
        )}

        {/* Edit Modal */}
        {editingAlbum && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Edit className="text-blue-400" />
                Edytuj Album
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingAlbum.band}
                  onChange={(e) =>
                    setEditingAlbum({ ...editingAlbum, band: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
                  placeholder="Nazwa zespołu"
                />
                <input
                  type="text"
                  value={editingAlbum.title}
                  onChange={(e) =>
                    setEditingAlbum({ ...editingAlbum, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
                  placeholder="Tytuł albumu"
                />
                <input
                  type="number"
                  value={editingAlbum.year}
                  onChange={(e) =>
                    setEditingAlbum({
                      ...editingAlbum,
                      year: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
                  placeholder="Rok"
                />
                <input
                  type="text"
                  value={editingAlbum.genre}
                  onChange={(e) =>
                    setEditingAlbum({ ...editingAlbum, genre: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
                  placeholder="Gatunek"
                />
                <input
                  type="url"
                  value={editingAlbum.cover}
                  onChange={(e) =>
                    setEditingAlbum({ ...editingAlbum, cover: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 shadow-lg"
                  placeholder="URL okładki"
                />
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => updateAlbum(editingAlbum.id, editingAlbum)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setEditingAlbum(null)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumManager;
