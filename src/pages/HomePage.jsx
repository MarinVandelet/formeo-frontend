import React, { useEffect, useMemo, useState } from "react";
import HeroSlider from "../components/HeroSlider.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import { fetchCategories } from "../api/categories";
import Footer from "../components/Footer";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchCategories()
      .then((data) => {
        if (!mounted) return;
        setCategories(data);
        setError(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError(true);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const reviews = useMemo(
    () => [
      {
        name: "Camille R.",
        role: "Apprenante",
        rating: 5,
        text: "Plateforme super fluide. Les contenus sont clairs et l’accompagnement est top.",
        avatar: "https://i.pravatar.cc/80?img=47",
      },
      {
        name: "Mehdi A.",
        role: "Apprenant",
        rating: 5,
        text: "Le format petit groupe m’a vraiment aidé. On progresse vite et on se sent suivi.",
        avatar: "https://i.pravatar.cc/80?img=12",
      },
      {
        name: "Sarah L.",
        role: "Apprenante",
        rating: 4,
        text: "Design propre, infos faciles à trouver. Les intervenants sont très pédagogues.",
        avatar: "https://i.pravatar.cc/80?img=5",
      },
    ],
    []
  );

  const StarRow = ({ rating = 5 }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-icons text-[18px] ${
            i < rating ? "text-amber-500" : "text-slate-300"
          }`}
        >
          star
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* HERO */}
      <HeroSlider />

      {/* WHY FORMEO */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Pourquoi choisir Formeo ?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Une expérience simple, humaine et efficace pour progresser.
            </p>
          </div>

          <a
            href="#categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900"
          >
            <span>Voir les catégories</span>
            <span className="material-icons text-[18px]">arrow_forward</span>
          </a>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "auto_awesome",
              title: "Parcours guidés",
              desc: "Des contenus structurés et progressifs.",
            },
            {
              icon: "groups",
              title: "Petits groupes",
              desc: "Sessions limitées pour un vrai suivi.",
            },
            {
              icon: "workspace_premium",
              title: "Formateurs experts",
              desc: "Professionnels avec pédagogie & méthode.",
            },
            {
              icon: "schedule",
              title: "Flexible",
              desc: "Apprenez à votre rythme, où que vous soyez.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <span className="material-icons text-indigo-700">
                  {f.icon}
                </span>
              </div>
              <p className="mt-3 font-semibold text-slate-900">{f.title}</p>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="max-w-6xl mx-auto px-4 pb-10">
        <CategoryGrid categories={categories} loading={loading} error={error} />
      </section>

      {/* REVIEWS */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08]">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=70"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Ils en parlent
                </p>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                  Avis d’étudiants
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Quelques retours (fictifs) pour illustrer la section.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-full text-sm">
                <span className="material-icons text-[18px]">star</span>
                <span className="font-semibold">4.8/5</span>
                <span className="text-amber-700">•</span>
                <span className="text-amber-800">+300 apprenants</span>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {r.name}
                      </p>
                      <p className="text-xs text-slate-500">{r.role}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <StarRow rating={r.rating} />
                  </div>

                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    “{r.text}”
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Si vous aussi vous voulez progresser, n’hésitez plus !
              </p>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                <span>Je découvre les formations</span>
                <span className="material-icons text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    <Footer />
    </div>
  );
};

export default HomePage;
