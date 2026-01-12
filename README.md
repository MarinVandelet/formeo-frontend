# TXLFORMA – Backend

## URL du site

**http://54.37.158.194/**

---

## Présentation du projet

TXLFORMA est une plateforme web de gestion de formations en présentiel destinée aux entreprises et aux particuliers.  
Ce dépôt correspond à la **partie backend** de l’application, développée avec **Spring Boot** et exposant une **API REST sécurisée**, consommée par un frontend React.

Le backend prend en charge :
- l’authentification et la gestion des utilisateurs,
- la gestion des formations, catégories et sessions,
- l’inscription aux formations,
- le paiement en ligne,
- le suivi de présence (émargement numérique),
- les évaluations des participants,
- la génération d’attestations PDF.

---

## Architecture générale

L’application suit une **architecture en couches** :

```
Controller
   ↓
Service
   ↓
Repository
   ↓
Base de données
```

Des **DTO et Mappers** sont utilisés afin de séparer les modèles internes des données exposées via l’API.

---

## Technologies utilisées

- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Spring Data JPA
- Stripe
- OpenPDF
- BCrypt
- REST API
- DTO / Mapper pattern

---

## Sécurité et authentification

- Authentification basée sur **JWT**
- Mots de passe chiffrés avec **BCrypt**
- Filtrage des requêtes via `JwtAuthFilter`
- Gestion des rôles utilisateurs (`Role`)

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
- Gestion des rôles

### Formations
- Catégories
- Formations par catégorie
- Sessions avec capacité limitée

### Paiement
- Paiement en ligne via **Stripe**
- Validation automatique de l’inscription

### Émargement & Évaluations
- Suivi de présence
- Attribution de notes
- Génération d’attestations PDF

---

## Lancement du projet

```bash
mvn clean install
mvn spring-boot:run
```

API disponible sur :
```
http://localhost:8080
```

---

## Déploiement

Backend prêt pour :
- Serveur cloud
- Docker
- Extension mobile
