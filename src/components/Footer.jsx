import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-indigo-600">school</span>
            <p className="font-semibold text-slate-900">Formeo</p>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Plateforme de formations. Progressez avec des contenus clairs, des
            sessions et un suivi de qualité.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <p className="text-sm font-semibold text-slate-900">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a href="#categories" className="hover:text-slate-900">
                Catégories
              </a>
            </li>
            <li>
              <Link to="/" className="hover:text-slate-900">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-slate-900">
                Connexion
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-sm font-semibold text-slate-900">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="material-icons text-[18px] text-slate-400">
                mail
              </span>
              <span>contact@formeo.fr</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-icons text-[18px] text-slate-400">
                place
              </span>
              <span>France</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-icons text-[18px] text-slate-400">
                schedule
              </span>
              <span>Lun–Ven • 9h–18h</span>
            </li>
          </ul>
        </div>
      </div>

      {/* LIENS */}
      <div className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Formeo — Tous droits réservés.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link to="/mentions-legales" className="hover:text-slate-900"> Mentions légales
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-slate-900"> Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
