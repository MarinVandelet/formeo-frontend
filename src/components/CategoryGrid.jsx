import React from "react";
import { Link } from "react-router-dom";

const CategoryGrid = ({ categories, loading, error }) => {
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-64 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-4 w-80 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="hidden sm:block h-4 w-56 bg-slate-100 rounded-md animate-pulse" />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-40 bg-slate-200 rounded-md animate-pulse" />
                  <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-100 rounded-md animate-pulse" />
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-100 animate-pulse" />
              </div>
              <div className="mt-4 h-8 w-28 bg-slate-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Chargement des catégories…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-medium text-red-700">
            Impossible de charger les catégories.
          </p>
          <p className="text-xs text-red-600 mt-1">Veuillez réessayer dans un instant.</p>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-medium text-slate-900">
            Aucune catégorie disponible
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Revenez plus tard, de nouvelles catégories arrivent bientôt.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="categories"
      className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Catalogue
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
            Catégories de formations
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Choisissez une catégorie pour voir les formations associées.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-2 text-xs text-slate-600 shadow-sm">
          <span className="material-icons text-[18px] text-indigo-600">
            category
          </span>
          <span className="font-medium text-slate-900">
            {categories.length}
          </span>
          <span>catégorie(s)</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.id}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition">
            {/* Fond léger */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-100 blur-2xl" />
              <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-sky-100 blur-2xl" />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                    {cat.nom}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                    {cat.description ||
                      "Découvrir les formations de cette catégorie."}
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center group-hover:border-indigo-200 transition">
                    <span className="material-icons text-[20px] text-slate-500 group-hover:text-indigo-700 transition-colors">
                      school
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                  Explorer
                  <span className="material-icons text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
