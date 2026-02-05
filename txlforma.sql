-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le : jeu. 05 fév. 2026 à 01:52
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `txlforma`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id` bigint NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `nom` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id`, `description`, `nom`) VALUES
(1, NULL, 'Réseaux et télécoms'),
(2, 'Windows Server, Linux, Unix et gestion des environnements systèmes', 'Administration système'),
(3, 'Frameworks frontend : Angular, React, VueJS, etc.', 'Développement Front'),
(4, 'Symfony, Spring Boot, Laravel, API REST, etc.', 'Développement Back'),
(5, 'Pack Office, Access, Excel avancé, Word, etc.', 'Bureautique'),
(6, 'Sécurité réseau, IDS/IPS, attaques, sécurité Web & BDD', 'Cybersécurité'),
(7, 'Gestion de projets via Jira, Trello, MS Project, méthodes agiles', 'Conduite de projets');

-- --------------------------------------------------------

--
-- Structure de la table `emargement`
--

CREATE TABLE `emargement` (
  `id` bigint NOT NULL,
  `date_heure_signature` datetime(6) NOT NULL,
  `signature_base64` longtext NOT NULL,
  `session_id` bigint NOT NULL,
  `utilisateur_id` bigint NOT NULL,
  `date_heure_emargement` datetime(6) NOT NULL,
  `jour_cours` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `emargement`
--

INSERT INTO `emargement` (`id`, `date_heure_signature`, `signature_base64`, `session_id`, `utilisateur_id`, `date_heure_emargement`, `jour_cours`) VALUES
(2, '2025-12-30 19:33:37.550410', 'data:image/png;base64,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', 1, 3, '2025-12-30 19:33:37.550410', '2025-12-30');

-- --------------------------------------------------------

--
-- Structure de la table `evaluation`
--

CREATE TABLE `evaluation` (
  `id` bigint NOT NULL,
  `commentaire` varchar(1000) DEFAULT NULL,
  `date_evaluation` datetime(6) NOT NULL,
  `note` int NOT NULL,
  `session_id` bigint NOT NULL,
  `utilisateur_id` bigint NOT NULL
) ;

-- --------------------------------------------------------

--
-- Structure de la table `formation`
--

CREATE TABLE `formation` (
  `id` bigint NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `duree_jours` int NOT NULL,
  `prix` decimal(38,2) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `categorie_id` bigint NOT NULL,
  `intervenant_id` bigint DEFAULT NULL
) ;

--
-- Déchargement des données de la table `formation`
--

INSERT INTO `formation` (`id`, `description`, `duree_jours`, `prix`, `titre`, `categorie_id`, `intervenant_id`) VALUES
(1, 'Tunnels VPN', 2, 500.00, 'Mise en place de tunnels VPN, filtrage et contrôle d’accès.', 1, 4),
(2, 'Mise en place de tunnels VPN, filtrage et contrôle d’accès.', 3, 900.00, 'VPN & sécurité réseau', 1, 4),
(3, 'Gestion AD, GPO, DNS, DHCP, sécurité et maintenance.', 7, 700.00, 'Administration Windows Server', 2, NULL),
(4, 'Administration Linux, networking, sécurité et scripting Bash.', 5, 1100.00, 'Linux avancé & shell', 2, NULL),
(5, 'Création de SPA, composants, services, routing et API REST.', 5, 950.00, 'Angular pour débutants', 3, NULL),
(6, 'Hooks, Redux, performance, optimisations et bonnes pratiques.', 5, 990.00, 'React avancé', 3, NULL),
(7, 'Construction d’API sécurisées, JPA, JWT, Docker.', 7, 400.00, 'Spring Boot API REST', 4, NULL),
(8, 'Architecture MVC, Doctrine, sécurité & optimisation.', 6, 1300.00, 'Symfony niveau intermédiaire', 4, NULL),
(9, 'Fonctions avancées, tableaux croisés dynamiques, automatisation.', 3, 450.00, 'Excel Professionnel', 5, NULL),
(10, 'Utilisation avancée pour entreprises et gestion documentaire.', 3, 400.00, 'Word & Access', 5, NULL),
(11, 'Injection SQL, XSS, CSRF, sécurisation des bases de données.', 4, 1300.00, 'Sécurité Web & BDD', 6, NULL),
(12, 'Revue des vulnérabilités, attaques, IDS/IPS, méthodologies.', 5, 1500.00, 'Introduction au pentest', 6, NULL),
(13, 'Scrum, Kanban, Jira, Trello, collaboration & suivi projet.', 4, 900.00, 'Gestion de projet Agile', 7, NULL),
(14, 'Planification, charge, échéancier, suivi et reporting.', 3, 850.00, 'MS Project complet', 7, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `inscription`
--

CREATE TABLE `inscription` (
  `id` bigint NOT NULL,
  `cree_le` datetime(6) NOT NULL,
  `statut` enum('ANNULEE','EN_ATTENTE','PAYEE') NOT NULL,
  `session_id` bigint NOT NULL,
  `utilisateur_id` bigint NOT NULL,
  `date_evaluation` datetime(6) DEFAULT NULL,
  `note` double DEFAULT NULL,
  `evaluateur_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `inscription`
--

INSERT INTO `inscription` (`id`, `cree_le`, `statut`, `session_id`, `utilisateur_id`, `date_evaluation`, `note`, `evaluateur_id`) VALUES
(11, '2025-12-30 15:26:55.556290', 'PAYEE', 1, 3, '2025-12-30 15:27:44.843788', 15, 4);

-- --------------------------------------------------------

--
-- Structure de la table `session`
--

CREATE TABLE `session` (
  `id` bigint NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `capacite` int NOT NULL,
  `date_debut` datetime(6) NOT NULL,
  `date_fin` datetime(6) NOT NULL,
  `salle` varchar(80) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `formation_id` bigint NOT NULL
) ;

--
-- Déchargement des données de la table `session`
--

INSERT INTO `session` (`id`, `adresse`, `capacite`, `date_debut`, `date_fin`, `salle`, `ville`, `formation_id`) VALUES
(1, '10 avenue de la République', 12, '2025-01-24 08:00:00.000000', '2025-12-31 16:00:00.000000', 'Salle A', 'Paris', 1),
(2, '10 avenue de la République', 12, '2026-01-08 08:00:00.000000', '2026-01-15 16:00:00.000000', 'Salle A', 'Paris', 1),
(3, '10 avenue de la République', 12, '2025-02-10 08:00:00.000000', '2025-02-17 16:00:00.000000', 'Salle A', 'Paris', 2);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` bigint NOT NULL,
  `adresse_postale` varchar(500) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `entreprise` varchar(150) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `nom` varchar(80) NOT NULL,
  `prenom` varchar(80) NOT NULL,
  `pseudo` varchar(60) NOT NULL,
  `role` enum('ADMIN','INTERVENANT','USER') NOT NULL,
  `telephone` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `adresse_postale`, `email`, `entreprise`, `mot_de_passe`, `nom`, `prenom`, `pseudo`, `role`, `telephone`) VALUES
(1, '2 avenue d\'osseville', 'jean@test.com', 'Test Corp', '$2a$10$H2DIvoTchQZeyvvLtRxP/.QrycqvumigHkWJSqC.ZIsSbywm59zvS', 'Dupont', 'Jean', 'jeandupont', 'USER', '0123456789'),
(2, '1 rue de la Paix', 'admin@example.com', 'Acme', '$2a$10$xzdE90LIhPPPpJLqghJ68ugyaParnqNWJJEw8UXq7IXcGoUbNbPii', 'Doe', 'John', 'johndoe', 'ADMIN', '0600000000'),
(3, '1 rue de la Paix', 'test@example.com', 'Acme', '$2a$10$u/X3038gf5JXuT6vc2xW1.v0ecW.EZXlvBfNtKSTT2V/vvyaGFV56', 'eleve', 'ecole', 'eleve', 'USER', '0600000000'),
(4, '1 rue de la Paix', 'prof@example.com', 'Acme', '$2a$10$faj7.EvuYZd9pkhBB9rEauZoOTMQf3ReIAipCicx7VltP.Ga55edC', 'Christiant', 'Arcolat', 'prof', 'INTERVENANT', '0600000000');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK89y3d23ia9ruhfhdmya9aspq7` (`nom`);

--
-- Index pour la table `emargement`
--
ALTER TABLE `emargement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_emargement_user_session_day` (`utilisateur_id`,`session_id`,`jour_cours`),
  ADD UNIQUE KEY `uk_emargement_user_session_jour` (`utilisateur_id`,`session_id`,`jour_cours`),
  ADD KEY `FK59qxb9n80d1e3ytbomtnhunfa` (`session_id`);

--
-- Index pour la table `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_evaluation_user_session` (`utilisateur_id`,`session_id`),
  ADD KEY `FKjnb5emr8j0sap1nemi8jrluld` (`session_id`);

--
-- Index pour la table `formation`
--
ALTER TABLE `formation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKdqimdmc2a0atvxbnrdi2k0t23` (`categorie_id`),
  ADD KEY `FKnjkuv8eju6usa7r7cbxtbbige` (`intervenant_id`);

--
-- Index pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_inscription_user_session` (`utilisateur_id`,`session_id`),
  ADD KEY `FKb3ckm4ansfumlubaocw95dwep` (`session_id`),
  ADD KEY `FKkkbjngwnmm22mbourh4k6ok1x` (`evaluateur_id`);

--
-- Index pour la table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKgxjpjguyud7yk8jb51ygcmay1` (`formation_id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_utilisateur_email` (`email`),
  ADD UNIQUE KEY `uk_utilisateur_pseudo` (`pseudo`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `emargement`
--
ALTER TABLE `emargement`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `inscription`
--
ALTER TABLE `inscription`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `session`
--
ALTER TABLE `session`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `emargement`
--
ALTER TABLE `emargement`
  ADD CONSTRAINT `FK46ubwfjp284y5vtei221lf5yo` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `FK59qxb9n80d1e3ytbomtnhunfa` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Contraintes pour la table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `FK76e3k0i0mulegsle1qapcie8` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `FKjnb5emr8j0sap1nemi8jrluld` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Contraintes pour la table `formation`
--
ALTER TABLE `formation`
  ADD CONSTRAINT `FKdqimdmc2a0atvxbnrdi2k0t23` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`),
  ADD CONSTRAINT `FKnjkuv8eju6usa7r7cbxtbbige` FOREIGN KEY (`intervenant_id`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD CONSTRAINT `FKb3ckm4ansfumlubaocw95dwep` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FKes0mtg0xssltfgqc6p8evlxpy` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `FKkkbjngwnmm22mbourh4k6ok1x` FOREIGN KEY (`evaluateur_id`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `FKgxjpjguyud7yk8jb51ygcmay1` FOREIGN KEY (`formation_id`) REFERENCES `formation` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
