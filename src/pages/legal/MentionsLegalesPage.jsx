import React from "react";

const MentionsLegalesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          Conformément aux dispositions des articles 6-III et 19 de la Loi
          n°2004-575 du 21 juin 2004 pour la Confiance dans l’Économie Numérique
          (LCEN), il est porté à la connaissance des utilisateurs du site
          <strong> Formeo</strong> les présentes mentions légales.
        </p>

        <h2 className="text-lg font-semibold mt-6">Éditeur du site</h2>
        <p>
          Nom du site : <strong>Formeo</strong><br />
          Type : Plateforme de formations en ligne<br />
          Responsable de la publication : <strong>Formeo</strong><br />
          Email : <strong>contact@formeo.fr</strong><br />
          Pays : France
        </p>

        <h2 className="text-lg font-semibold mt-6">Hébergement</h2>
        <p>
          Le site est hébergé par un prestataire cloud sécurisé situé dans
          l’Union Européenne.
        </p>

        <h2 className="text-lg font-semibold mt-6">Accès au site</h2>
        <p>
          Le site est accessible 24h/24, 7j/7 sauf interruption pour maintenance
          technique ou cas de force majeure.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          Propriété intellectuelle
        </h2>
        <p>
          L’ensemble des contenus présents sur le site Formeo (textes,
          graphismes, logo, structure) est protégé par le droit d’auteur.
          Toute reproduction sans autorisation est interdite.
        </p>

        <h2 className="text-lg font-semibold mt-6">Responsabilité</h2>
        <p>
          Formeo ne saurait être tenu responsable des dommages directs ou
          indirects résultant de l’utilisation du site ou de l’impossibilité
          d’y accéder.
        </p>
      </section>
    </div>
  );
};

export default MentionsLegalesPage;
