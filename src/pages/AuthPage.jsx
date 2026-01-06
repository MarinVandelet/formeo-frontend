import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";
import Footer from "../components/Footer";

const InputWithIcon = React.memo(function InputWithIcon({
  icon,
  label,
  required,
  inputBase,
  labelBase,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={labelBase}>
        {label} {required ? "*" : ""}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <span className="material-icons text-[18px]">{icon}</span>
        </span>
        <input {...props} className={`${inputBase} pl-10`} />
      </div>
    </div>
  );
});

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    pseudo: "",
    motDePasse: "",
    telephone: "",
    entreprise: "",
    adressePostale: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ handler safe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await loginUser({
        email: form.email,
        motDePasse: form.motDePasse,
      });

      const token = res?.token;
      if (!token) throw new Error("Aucun token reçu");

      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error("Erreur login:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Identifiants invalides ou erreur serveur.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await registerUser(form);
      setMode("login");
      setInfo("Compte créé ✅ Vous pouvez maintenant vous connecter.");
      setForm((f) => ({ ...f, motDePasse: "" }));
    } catch (err) {
      console.error("Erreur register:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Erreur lors de l'inscription.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-300";
  const labelBase = "text-xs md:text-sm font-medium text-slate-600";

  const tabBtn = (active) =>
    `flex-1 py-2.5 text-sm md:text-base font-semibold rounded-xl transition ${
      active
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT VISUEL */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hidden lg:block">
            <div className="absolute inset-0 opacity-[0.18]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=70"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative p-8 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-slate-200 text-slate-700 text-xs">
                  <span className="material-icons text-indigo-600 text-[18px]">
                    school
                  </span>
                  <span className="font-semibold">Formeo</span>
                  <span className="text-slate-400">•</span>
                  <span>Espace membre</span>
                </div>

                <h1 className="mt-5 text-3xl font-semibold text-slate-900 leading-tight">
                  Connexion sécurisée
                </h1>
                <p className="mt-2 text-slate-700">
                  Accédez à vos formations, inscriptions et attestations.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: "lock", title: "Sécurisé", desc: "Token & session" },
                    { icon: "devices", title: "Responsive", desc: "Mobile & PC" },
                    { icon: "schedule", title: "Rapide", desc: "Sans friction" },
                    { icon: "verified", title: "Simple", desc: "Tout centralisé" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <span className="material-icons text-indigo-700 text-[18px]">
                            {f.icon}
                          </span>
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {f.title}
                          </p>
                          <p className="text-xs text-slate-600">{f.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} Formeo
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Espace membre
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-1">
                    {mode === "login" ? "Connexion" : "Inscription"}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {mode === "login"
                      ? "Connectez-vous pour accéder à votre espace."
                      : "Créez votre compte (mêmes infos que votre version initiale)."}
                  </p>
                </div>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span className="material-icons text-[18px]">arrow_back</span>
                  Accueil
                </Link>
              </div>

              <div className="mt-6 p-1 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-1">
                <button
                  type="button"
                  className={tabBtn(mode === "login")}
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setInfo("");
                  }}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  className={tabBtn(mode === "register")}
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setInfo("");
                  }}
                >
                  Inscription
                </button>
              </div>

              {error && (
                <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
                  {error}
                </div>
              )}

              {info && (
                <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  {info}
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              {mode === "login" ? (
                <form onSubmit={onSubmitLogin} className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm">
                    <div className="grid gap-4">
                      <InputWithIcon
                        icon="mail"
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ex: prenom.nom@email.com"
                        required
                        inputBase={inputBase}
                        labelBase={labelBase}
                      />
                      <InputWithIcon
                        icon="lock"
                        label="Mot de passe"
                        type="password"
                        name="motDePasse"
                        value={form.motDePasse}
                        onChange={handleChange}
                        placeholder="Votre mot de passe"
                        required
                        inputBase={inputBase}
                        labelBase={labelBase}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-indigo-600 text-white text-base py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-[20px]">
                      {loading ? "hourglass_top" : "login"}
                    </span>
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={onSubmitRegister}
                  className="space-y-5 max-h-[70vh] overflow-y-auto pr-1"
                >
                  <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithIcon
                        icon="person"
                        label="Prénom"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                        inputBase={inputBase}
                        labelBase={labelBase}
                      />
                      <InputWithIcon
                        icon="person"
                        label="Nom"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                        inputBase={inputBase}
                        labelBase={labelBase}
                      />
                    </div>

                    <InputWithIcon
                      icon="alternate_email"
                      label="Pseudo"
                      name="pseudo"
                      value={form.pseudo}
                      onChange={handleChange}
                      required
                      inputBase={inputBase}
                      labelBase={labelBase}
                    />

                    <InputWithIcon
                      icon="mail"
                      label="Email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      inputBase={inputBase}
                      labelBase={labelBase}
                    />

                    <InputWithIcon
                      icon="lock"
                      label="Mot de passe"
                      type="password"
                      name="motDePasse"
                      value={form.motDePasse}
                      onChange={handleChange}
                      required
                      inputBase={inputBase}
                      labelBase={labelBase}
                    />

                    <InputWithIcon
                      icon="call"
                      label="Téléphone"
                      name="telephone"
                      value={form.telephone}
                      onChange={handleChange}
                      inputBase={inputBase}
                      labelBase={labelBase}
                    />

                    <InputWithIcon
                      icon="apartment"
                      label="Entreprise"
                      name="entreprise"
                      value={form.entreprise}
                      onChange={handleChange}
                      inputBase={inputBase}
                      labelBase={labelBase}
                    />

                    <InputWithIcon
                      icon="home"
                      label="Adresse postale"
                      name="adressePostale"
                      value={form.adressePostale}
                      onChange={handleChange}
                      inputBase={inputBase}
                      labelBase={labelBase}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-indigo-600 text-white text-base py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-[20px]">
                      {loading ? "hourglass_top" : "person_add"}
                    </span>
                    {loading ? "Inscription..." : "Créer mon compte"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
