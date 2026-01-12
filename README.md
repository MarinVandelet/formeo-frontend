# TXLFORMA – Frontend

## URL du site

👉 **http://54.37.158.194/**

---

## Présentation du projet

TXLFORMA est une plateforme web de gestion de formations en présentiel.
Ce dépôt correspond à la **partie frontend** de l’application, développée avec **React** et consommant une **API REST sécurisée** fournie par le backend Spring Boot.

Le frontend permet :
- la consultation des formations et catégories,
- l’inscription et la connexion des utilisateurs,
- le paiement en ligne,
- l’accès à un espace personnel,
- la gestion administrateur,
- l’accès à une salle de formation immersive en 3D.

---

## Technologies utilisées

- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Three.js
- React Three Fiber
- @react-three/drei
- Stripe (via backend)

---

## Architecture du projet

```
src/
 ├── api/          → appels API (Axios)
 ├── components/   → composants réutilisables
 │    ├── ui/
 │    ├── profile/
 │    └── three/
 ├── pages/        → pages principales
 ├── data/         → données pour la scène 3D
 ├── App.jsx       → routing
 └── main.jsx      → point d’entrée
```

---

## Authentification

- Authentification via **JWT**
- Token stocké dans le `localStorage`
- Rôles gérés côté frontend :
  - USER
  - INTERVENANT
  - ADMIN

---

## Comptes de test

| Rôle | Email | Mot de passe |
|-----|------|--------------|
| Administrateur | admin@example.com | Password123! |
| Formateur | prof@example.com | Password123! |
| Utilisateur | test@example.com | Password123! |

---

## Fonctionnalités principales

### Utilisateurs
- Inscription
- Connexion
- Profil utilisateur
- Accès aux attestations

### Formations
- Catégories
- Liste des formations
- Sessions disponibles

### Paiement
- Paiement en ligne via Stripe
- Page de confirmation

### Administration
- Dashboard admin
- Gestion utilisateurs
- Gestion catégories
- Gestion formations et sessions
- Consultation des émargements

### Salle immersive 3D
- Navigation libre
- Zoom sur éléments
- Gestion de visibilité
- Menu interactif
- Commandes clavier et souris

---

## ⚙️ Lancement du projet

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
npm install
npm run dev
```

Le frontend est accessible par défaut sur :
```
http://localhost:5173
```

---

## 🚀 Déploiement

Le frontend est :
- compatible hébergement cloud,
- prêt pour un build production,
- connecté à un backend sécurisé.

---

## 📌 Auteur

Projet réalisé dans un cadre académique / professionnel  
Frontend développé avec **React**
