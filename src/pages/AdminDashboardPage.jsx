import React, { useEffect, useState } from "react";
import { fetchMe } from "../api/auth";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/users";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories";
import {
  fetchFormations,
  createFormation,
  updateFormation,
  deleteFormation,
} from "../api/formations";
import {
  fetchSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../api/sessions";
import { fetchFeuilleEmargement } from "../api/emargements";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
};

const roles = ["USER", "INTERVENANT", "ADMIN"];

const AdminModal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
      <div className="bg-white max-w-xl w-full mx-4 rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [user, setUser] = useState(null);
  // 👉 nouvel onglet par défaut = statistiques
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // USERS
  const [usersList, setUsersList] = useState([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    pseudo: "",
    telephone: "",
    entreprise: "",
    adressePostale: "",
    role: "USER",
  });

  // CATEGORIES
  const [categories, setCategories] = useState([]);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ nom: "" });

  // FORMATIONS
  const [formations, setFormations] = useState([]);
  const [formationModalOpen, setFormationModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [formationForm, setFormationForm] = useState({
    titre: "",
    description: "",
    categorieId: "",
    intervenantId: "",
    prix: "",
    dureeJours: "",
  });

  // SESSIONS
  const [sessions, setSessions] = useState([]);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    formationId: "",
    dateDebut: "",
    dateFin: "",
    capacite: "",
    ville: "",
    adresse: "",
    salle: "",
  });

  // Feuilles d'émargement
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [sheetSession, setSheetSession] = useState(null);
  const [sheetDate, setSheetDate] = useState("");
  const [sheetLines, setSheetLines] = useState([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetError, setSheetError] = useState("");

  // ----------------------------------------------------------------

  const loadMe = async () => {
    setLoading(true);
    setError("");
    try {
      const me = await fetchMe();
      if (me.role !== "ADMIN") {
        setError("Accès réservé aux administrateurs.");
      }
      setUser(me);
    } catch (err) {
      console.error("Erreur fetchMe admin:", err);
      setError("Impossible de charger votre profil admin.");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const list = await fetchUsers();
      setUsersList(list);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
      setError("Impossible de charger les utilisateurs.");
    }
  };

  const loadCategories = async () => {
    try {
      const list = await fetchCategories();
      setCategories(list);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
      setError("Impossible de charger les catégories.");
    }
  };

  const loadFormations = async () => {
    try {
      const list = await fetchFormations();
      setFormations(list);
    } catch (err) {
      console.error("Erreur chargement formations:", err);
      setError("Impossible de charger les formations.");
    }
  };

  const loadSessions = async () => {
    try {
      const list = await fetchSessions();
      setSessions(list);
    } catch (err) {
      console.error("Erreur chargement sessions:", err);
      setError("Impossible de charger les sessions.");
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    setError("");

    if (activeTab === "stats") {
      // pour les stats on a besoin de tout
      loadUsers();
      loadCategories();
      loadFormations();
      loadSessions();
    }

    if (activeTab === "users") loadUsers();
    if (activeTab === "categories") loadCategories();
    if (activeTab === "formations") {
      loadCategories();
      loadFormations();
      loadUsers();
    }
    if (activeTab === "sessions") {
      loadSessions();
      loadFormations();
      loadUsers();
    }
  }, [user, activeTab]);

  // ----------------------------------------------------------------
  // USERS handlers
  // ----------------------------------------------------------------

  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      nom: "",
      prenom: "",
      email: "",
      pseudo: "",
      telephone: "",
      entreprise: "",
      adressePostale: "",
      role: "USER",
    });
    setUserModalOpen(true);
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      nom: u.nom || "",
      prenom: u.prenom || "",
      email: u.email || "",
      pseudo: u.pseudo || "",
      telephone: u.telephone || "",
      entreprise: u.entreprise || "",
      adressePostale: u.adressePostale || "",
      role: u.role || "USER",
    });
    setUserModalOpen(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userForm);
      } else {
        await createUser(userForm);
      }
      setUserModalOpen(false);
      await loadUsers();
    } catch (err) {
      console.error("Erreur save user:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible d'enregistrer l'utilisateur.";
      setError(msg);
    }
  };

  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Supprimer l'utilisateur ${u.email} ?`)) return;
    setError("");
    try {
      await deleteUser(u.id);
      await loadUsers();
    } catch (err) {
      console.error("Erreur delete user:", err);
      setError("Impossible de supprimer l'utilisateur.");
    }
  };

  // ----------------------------------------------------------------
  // CATEGORIES handlers
  // ----------------------------------------------------------------

  const openCreateCat = () => {
    setEditingCat(null);
    setCatForm({ nom: "" });
    setCatModalOpen(true);
  };

  const openEditCat = (c) => {
    setEditingCat(c);
    setCatForm({ nom: c.nom || "" });
    setCatModalOpen(true);
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, catForm);
      } else {
        await createCategory(catForm);
      }
      setCatModalOpen(false);
      await loadCategories();
    } catch (err) {
      console.error("Erreur save catégorie:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible d'enregistrer la catégorie.";
      setError(msg);
    }
  };

  const handleDeleteCat = async (c) => {
    if (
      !window.confirm(
        `Supprimer la catégorie "${c.nom}" ? (et potentiellement ses formations)`
      )
    )
      return;
    setError("");
    try {
      await deleteCategory(c.id);
      await loadCategories();
    } catch (err) {
      console.error("Erreur delete catégorie:", err);
      setError("Impossible de supprimer la catégorie.");
    }
  };

  // ----------------------------------------------------------------
  // FORMATIONS handlers
  // ----------------------------------------------------------------

  const openCreateFormation = () => {
    setEditingFormation(null);
    setFormationForm({
      titre: "",
      description: "",
      categorieId: "",
      intervenantId: "",
      prix: "",
      dureeJours: "",
    });
    setFormationModalOpen(true);
  };

  const openEditFormation = (f) => {
    setEditingFormation(f);
    setFormationForm({
      titre: f.titre || "",
      description: f.description || "",
      categorieId: f.categorie?.id || "",
      intervenantId: f.intervenant?.id || "",
      prix: f.prix ?? "",
      dureeJours: f.dureeJours ?? "",
    });
    setFormationModalOpen(true);
  };

  const saveFormation = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      titre: formationForm.titre,
      description: formationForm.description,
      prix:
        formationForm.prix !== "" ? Number(formationForm.prix) : undefined,
      dureeJours:
        formationForm.dureeJours !== ""
          ? Number(formationForm.dureeJours)
          : undefined,
      categorie: formationForm.categorieId
        ? { id: Number(formationForm.categorieId) }
        : null,
      intervenant: formationForm.intervenantId
        ? { id: Number(formationForm.intervenantId) }
        : null,
    };

    try {
      if (editingFormation) {
        await updateFormation(editingFormation.id, payload);
      } else {
        await createFormation(payload);
      }
      setFormationModalOpen(false);
      await loadFormations();
    } catch (err) {
      console.error("Erreur save formation:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible d'enregistrer la formation.";
      setError(msg);
    }
  };

  const handleDeleteFormation = async (f) => {
    if (
      !window.confirm(
        `Supprimer la formation "${f.titre}" ? (et potentiellement ses sessions)`
      )
    )
      return;
    setError("");
    try {
      await deleteFormation(f.id);
      await loadFormations();
    } catch (err) {
      console.error("Erreur delete formation:", err);
      setError("Impossible de supprimer la formation.");
    }
  };

  // ----------------------------------------------------------------
  // SESSIONS handlers
  // ----------------------------------------------------------------

  const openCreateSession = () => {
    setEditingSession(null);
    setSessionForm({
      formationId: "",
      dateDebut: "",
      dateFin: "",
      capacite: "",
      ville: "",
      adresse: "",
      salle: "",
    });
    setSessionModalOpen(true);
  };

  const openEditSession = (s) => {
    setEditingSession(s);
    setSessionForm({
      formationId: s.formation?.id || "",
      dateDebut: s.dateDebut ? s.dateDebut.slice(0, 16) : "",
      dateFin: s.dateFin ? s.dateFin.slice(0, 16) : "",
      capacite: s.capacite ?? "",
      ville: s.ville || "",
      adresse: s.adresse || "",
      salle: s.salle || "",
    });
    setSessionModalOpen(true);
  };

  const saveSession = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      formation: sessionForm.formationId
        ? { id: Number(sessionForm.formationId) }
        : null,
      dateDebut: sessionForm.dateDebut ? sessionForm.dateDebut + ":00" : null,
      dateFin: sessionForm.dateFin ? sessionForm.dateFin + ":00" : null,
      capacite:
        sessionForm.capacite !== "" ? Number(sessionForm.capacite) : null,
      ville: sessionForm.ville || null,
      adresse: sessionForm.adresse || null,
      salle: sessionForm.salle || null,
    };

    try {
      if (editingSession) {
        await updateSession(editingSession.id, payload);
      } else {
        await createSession(payload);
      }
      setSessionModalOpen(false);
      await loadSessions();
    } catch (err) {
      console.error("Erreur save session:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible d'enregistrer la session.";
      setError(msg);
    }
  };

  const handleDeleteSession = async (s) => {
    if (
      !window.confirm(
        `Supprimer la session #${s.id} de "${s.formation?.titre || ""}" ?`
      )
    )
      return;
    setError("");
    try {
      await deleteSession(s.id);
      await loadSessions();
    } catch (err) {
      console.error("Erreur delete session:", err);
      setError("Impossible de supprimer la session.");
    }
  };

  // Feuilles d'émargement
  const openSheetModal = async (s) => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    setSheetSession(s);
    setSheetDate(iso);
    setSheetModalOpen(true);
    await loadSheet(s.id, iso);
  };

  const loadSheet = async (sessionId, dateStr) => {
    setSheetLoading(true);
    setSheetError("");
    setSheetLines([]);
    try {
      const data = await fetchFeuilleEmargement(sessionId, dateStr);
      setSheetLines(data);
    } catch (err) {
      console.error("Erreur feuille admin:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible de charger la feuille d'émargement.";
      setSheetError(msg);
    } finally {
      setSheetLoading(false);
    }
  };

  const handleSheetDateChange = async (e) => {
    const value = e.target.value;
    setSheetDate(value);
    if (sheetSession) {
      await loadSheet(sheetSession.id, value);
    }
  };

  // ----------------------------------------------------------------

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-slate-500">
          Chargement du tableau de bord admin...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-red-600">
          Accès refusé. Cette page est réservée aux administrateurs.
        </p>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // VUES D'ONGLETS
  // ----------------------------------------------------------------

  const renderStatsTab = () => {
    const totalUsers = usersList.length;
    const totalIntervenants = usersList.filter(
      (u) => u.role === "INTERVENANT"
    ).length;
    const totalAdmins = usersList.filter((u) => u.role === "ADMIN").length;

    const totalCategories = categories.length;
    const totalFormations = formations.length;
    const totalSessions = sessions.length;

    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Statistiques générales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-slate-500">Utilisateurs inscrits</p>
            <p className="text-2xl font-semibold">{totalUsers}</p>
            <p className="text-[11px] text-slate-400">
              {totalIntervenants} intervenant(s), {totalAdmins} admin(s)
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-slate-500">Catégories</p>
            <p className="text-2xl font-semibold">{totalCategories}</p>
            <p className="text-[11px] text-slate-400">
              Regroupent les thématiques de vos formations
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-slate-500">Formations</p>
            <p className="text-2xl font-semibold">{totalFormations}</p>
            <p className="text-[11px] text-slate-400">
              Programmes disponibles dans Formeo
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-slate-500">Sessions planifiées</p>
            <p className="text-2xl font-semibold">{totalSessions}</p>
            <p className="text-[11px] text-slate-400">
              Sessions actives ou à venir
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Ces statistiques sont calculées à partir des données actuelles du
          système (utilisateurs, catégories, formations et sessions).
        </p>
      </section>
    );
  };

  const renderUsersTab = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Utilisateurs</h2>
        <button
          onClick={openCreateUser}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs hover:bg-indigo-700"
        >
          <span className="material-icons text-xs">person_add</span>
          <span>Créer un utilisateur</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Pseudo</th>
              <th className="px-3 py-2 text-left">Rôle</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-3 py-2">
                  {u.prenom} {u.nom}
                </td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.pseudo}</td>
                <td className="px-3 py-2">{u.role}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => openEditUser(u)}
                    className="text-xs text-indigo-600 mr-2 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {usersList.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-xs text-slate-500" colSpan={5}>
                  Aucun utilisateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={userModalOpen}
        title={editingUser ? "Modifier l'utilisateur" : "Créer un utilisateur"}
        onClose={() => setUserModalOpen(false)}
      >
        <form className="space-y-3" onSubmit={saveUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">Prénom</label>
              <input
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={userForm.prenom}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, prenom: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Nom</label>
              <input
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={userForm.nom}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, nom: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600">Email</label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={userForm.email}
              onChange={(e) =>
                setUserForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Pseudo</label>
            <input
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={userForm.pseudo}
              onChange={(e) =>
                setUserForm((f) => ({ ...f, pseudo: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">Téléphone</label>
              <input
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={userForm.telephone}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, telephone: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Entreprise</label>
              <input
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={userForm.entreprise}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, entreprise: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600">Adresse postale</label>
            <input
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={userForm.adressePostale}
              onChange={(e) =>
                setUserForm((f) => ({
                  ...f,
                  adressePostale: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Rôle</label>
            <select
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={userForm.role}
              onChange={(e) =>
                setUserForm((f) => ({ ...f, role: e.target.value }))
              }
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setUserModalOpen(false)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </AdminModal>
    </section>
  );

  const renderCategoriesTab = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Catégories</h2>
        <button
          onClick={openCreateCat}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs hover:bg-indigo-700"
        >
          <span className="material-icons text-xs">add</span>
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.nom}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => openEditCat(c)}
                    className="text-xs text-indigo-600 mr-2 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteCat(c)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-xs text-slate-500" colSpan={2}>
                  Aucune catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={catModalOpen}
        title={editingCat ? "Modifier la catégorie" : "Nouvelle catégorie"}
        onClose={() => setCatModalOpen(false)}
      >
        <form className="space-y-3" onSubmit={saveCategory}>
          <div>
            <label className="text-xs text-slate-600">Nom</label>
            <input
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={catForm.nom}
              onChange={(e) =>
                setCatForm((f) => ({ ...f, nom: e.target.value }))
              }
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCatModalOpen(false)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </AdminModal>
    </section>
  );

  const renderFormationsTab = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Formations</h2>
        <button
          onClick={openCreateFormation}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs hover:bg-indigo-700"
        >
          <span className="material-icons text-xs">add</span>
          <span>Nouvelle formation</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">Titre</th>
              <th className="px-3 py-2 text-left">Catégorie</th>
              <th className="px-3 py-2 text-left">Intervenant</th>
              <th className="px-3 py-2 text-left">Prix</th>
              <th className="px-3 py-2 text-left">Durée</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formations.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-3 py-2">{f.titre}</td>
                <td className="px-3 py-2">{f.categorie?.nom || "-"}</td>
                <td className="px-3 py-2">
                  {f.intervenant
                    ? `${f.intervenant.prenom} ${f.intervenant.nom}`
                    : "-"}
                </td>
                <td className="px-3 py-2">
                  {f.prix != null ? `${Number(f.prix).toFixed(2)} €` : "-"}
                </td>
                <td className="px-3 py-2">
                  {f.dureeJours != null ? `${f.dureeJours} j` : "-"}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => openEditFormation(f)}
                    className="text-xs text-indigo-600 mr-2 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteFormation(f)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {formations.length === 0 && (
              <tr>
                <td
                  className="px-3 py-3 text-xs text-slate-500"
                  colSpan={6}
                >
                  Aucune formation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={formationModalOpen}
        title={
          editingFormation ? "Modifier la formation" : "Nouvelle formation"
        }
        onClose={() => setFormationModalOpen(false)}
      >
        <form className="space-y-3" onSubmit={saveFormation}>
          <div>
            <label className="text-xs text-slate-600">Titre</label>
            <input
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={formationForm.titre}
              onChange={(e) =>
                setFormationForm((f) => ({ ...f, titre: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Description</label>
            <textarea
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs min-h-[60px]"
              value={formationForm.description}
              onChange={(e) =>
                setFormationForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">Catégorie</label>
              <select
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={formationForm.categorieId}
                onChange={(e) =>
                  setFormationForm((f) => ({
                    ...f,
                    categorieId: e.target.value,
                  }))
                }
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600">Intervenant</label>
              <select
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={formationForm.intervenantId}
                onChange={(e) =>
                  setFormationForm((f) => ({
                    ...f,
                    intervenantId: e.target.value,
                  }))
                }
              >
                <option value="">—</option>
                {usersList
                  .filter((u) => u.role === "INTERVENANT")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.prenom} {u.nom} ({u.email})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={formationForm.prix}
                onChange={(e) =>
                  setFormationForm((f) => ({ ...f, prix: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Durée (jours)</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={formationForm.dureeJours}
                onChange={(e) =>
                  setFormationForm((f) => ({
                    ...f,
                    dureeJours: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormationModalOpen(false)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </AdminModal>
    </section>
  );

  const renderSessionsTab = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sessions & émargements</h2>
        <button
          onClick={openCreateSession}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs hover:bg-indigo-700"
        >
          <span className="material-icons text-xs">add</span>
          <span>Nouvelle session</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">Formation</th>
              <th className="px-3 py-2 text-left">Dates</th>
              <th className="px-3 py-2 text-left">Lieu</th>
              <th className="px-3 py-2 text-left">Capacité</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-3 py-2">
                  {s.formation?.titre || `Session ${s.id}`}
                </td>
                <td className="px-3 py-2">
                  {formatDateTime(s.dateDebut)} → {formatDateTime(s.dateFin)}
                </td>
                <td className="px-3 py-2">
                  {s.ville
                    ? `${s.ville}${s.salle ? " – " + s.salle : ""}`
                    : "-"}
                </td>
                <td className="px-3 py-2">
                  {s.capacite != null ? s.capacite : "-"}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    onClick={() => openSheetModal(s)}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Émargements
                  </button>
                  <button
                    onClick={() => openEditSession(s)}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteSession(s)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td
                  className="px-3 py-3 text-xs text-slate-500"
                  colSpan={5}
                >
                  Aucune session.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal création / édition session */}
      <AdminModal
        open={sessionModalOpen}
        title={editingSession ? "Modifier la session" : "Nouvelle session"}
        onClose={() => setSessionModalOpen(false)}
      >
        <form className="space-y-3" onSubmit={saveSession}>
          <div>
            <label className="text-xs text-slate-600">Formation</label>
            <select
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={sessionForm.formationId}
              onChange={(e) =>
                setSessionForm((f) => ({
                  ...f,
                  formationId: e.target.value,
                }))
              }
              required
            >
              <option value="">Choisir une formation</option>
              {formations.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">
                Début (date & heure)
              </label>
              <input
                type="datetime-local"
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={sessionForm.dateDebut}
                onChange={(e) =>
                  setSessionForm((f) => ({
                    ...f,
                    dateDebut: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">
                Fin (date & heure)
              </label>
              <input
                type="datetime-local"
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={sessionForm.dateFin}
                onChange={(e) =>
                  setSessionForm((f) => ({
                    ...f,
                    dateFin: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-600">Capacité</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={sessionForm.capacite}
                onChange={(e) =>
                  setSessionForm((f) => ({
                    ...f,
                    capacite: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Ville</label>
              <input
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={sessionForm.ville}
                onChange={(e) =>
                  setSessionForm((f) => ({ ...f, ville: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Salle</label>
              <input
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                value={sessionForm.salle}
                onChange={(e) =>
                  setSessionForm((f) => ({ ...f, salle: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600">Adresse complète</label>
            <input
              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              value={sessionForm.adresse}
              onChange={(e) =>
                setSessionForm((f) => ({ ...f, adresse: e.target.value }))
              }
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSessionModalOpen(false)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Modal feuille d'émargement */}
      <AdminModal
        open={sheetModalOpen}
        title={
          sheetSession
            ? `Feuille d'émargement – Session #${sheetSession.id}`
            : "Feuille d'émargement"
        }
        onClose={() => setSheetModalOpen(false)}
      >
        {sheetSession && (
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xs text-slate-600">
                  {sheetSession.formation?.titre || "Formation"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {formatDate(sheetSession.dateDebut)} →{" "}
                  {formatDate(sheetSession.dateFin)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600">Jour de cours :</span>
                <input
                  type="date"
                  className="border border-slate-300 rounded-md px-2 py-1 text-xs"
                  value={sheetDate}
                  onChange={handleSheetDateChange}
                />
              </div>
            </div>

            {sheetError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {sheetError}
              </div>
            )}

            {sheetLoading ? (
              <p className="text-xs text-slate-500">
                Chargement de la feuille d&apos;émargement...
              </p>
            ) : sheetLines.length === 0 ? (
              <p className="text-xs text-slate-500">
                Aucun inscrit payé ou aucune donnée d&apos;émargement pour ce
                jour.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-md">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Élève</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Statut</th>
                      <th className="px-3 py-2 text-left">
                        Heure d&apos;émargement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheetLines.map((l) => (
                      <tr key={l.utilisateurId} className="border-t">
                        <td className="px-3 py-1.5">
                          {l.prenom} {l.nom}
                        </td>
                        <td className="px-3 py-1.5">{l.email}</td>
                        <td className="px-3 py-1.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[11px] ${
                              l.present
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {l.present ? "Présent" : "Absent"}
                          </span>
                        </td>
                        <td className="px-3 py-1.5">
                          {l.dateHeureEmargement
                            ? new Date(
                                l.dateHeureEmargement
                              ).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              Seuls les jours de cours (lundi à vendredi) compris dans la
              période de la session sont autorisés pour l&apos;émargement.
            </p>
          </div>
        )}
      </AdminModal>
    </section>
  );

  // ----------------------------------------------------------------

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard administrateur</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les utilisateurs, les catégories, les formations, les
            sessions et visualisez les feuilles d&apos;émargement.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end text-xs text-slate-500">
          <span>{user.email}</span>
          <span>Rôle : {user.role}</span>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-2 border-b border-slate-200 text-xs">
        {[
          { key: "stats", label: "Statistiques" },
          { key: "users", label: "Utilisateurs" },
          { key: "categories", label: "Catégories" },
          { key: "formations", label: "Formations" },
          { key: "sessions", label: "Sessions & émargements" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu onglet */}
      {activeTab === "stats" && renderStatsTab()}
      {activeTab === "users" && renderUsersTab()}
      {activeTab === "categories" && renderCategoriesTab()}
      {activeTab === "formations" && renderFormationsTab()}
      {activeTab === "sessions" && renderSessionsTab()}
    </div>
  );
};

export default AdminDashboardPage;
