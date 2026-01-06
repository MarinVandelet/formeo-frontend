import React from "react";

const PolitiqueConfidentialitePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">
        Politique de protection des données personnelles
      </h1>

      <section className="space-y-5 text-sm leading-relaxed">
        <p>
          La présente politique explique comment <strong>Formeo</strong> collecte,
          utilise et protège les données personnelles des utilisateurs
          conformément au Règlement Général sur la Protection des Données (RGPD).
        </p>

        <h2 className="text-lg font-semibold">1. Données collectées</h2>
        <p>
          Lors de l’utilisation du site, nous pouvons collecter les données
          suivantes :
        </p>
        <ul className="list-disc pl-6">
          <li>Nom et prénom</li>
          <li>Email</li>
          <li>Pseudo</li>
          <li>Téléphone</li>
          <li>Adresse postale</li>
          <li>Données de connexion (token, session)</li>
        </ul>

        <h2 className="text-lg font-semibold">2. Finalités du traitement</h2>
        <ul className="list-disc pl-6">
          <li>Création et gestion des comptes utilisateurs</li>
          <li>Accès aux formations et aux sessions</li>
          <li>Gestion des paiements et inscriptions</li>
          <li>Sécurité et prévention des fraudes</li>
        </ul>

        <h2 className="text-lg font-semibold">3. Cookies</h2>
        <p>
          Le site utilise des cookies strictement nécessaires au bon
          fonctionnement de la plateforme :
        </p>
        <ul className="list-disc pl-6">
          <li>Cookies d’authentification</li>
          <li>Cookies de session</li>
          <li>Stockage local (token JWT)</li>
        </ul>
        <p>
          Aucun cookie publicitaire tiers n’est utilisé.
        </p>

        <h2 className="text-lg font-semibold">4. Durée de conservation</h2>
        <p>
          Les données sont conservées uniquement pendant la durée nécessaire
          aux finalités pour lesquelles elles sont collectées.
        </p>

        <h2 className="text-lg font-semibold">5. Sécurité</h2>
        <p>
          Les données sont stockées de manière sécurisée et l’accès est limité
          aux personnes autorisées.
        </p>

        <h2 className="text-lg font-semibold">6. Droits des utilisateurs</h2>
        <p>
          Conformément à la réglementation, vous disposez des droits suivants :
        </p>
        <ul className="list-disc pl-6">
          <li>Droit d’accès</li>
          <li>Droit de rectification</li>
          <li>Droit à l’effacement</li>
          <li>Droit d’opposition</li>
        </ul>

        <p>
          Toute demande peut être adressée à :
          <strong> contact@formeo.fr</strong>
        </p>
      </section>
    </div>
  );
};

export default PolitiqueConfidentialitePage;
