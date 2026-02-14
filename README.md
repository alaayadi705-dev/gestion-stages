🎓 Gestion des Stages à l’Étranger
📌 Description du Projet

Ce projet est une application web développée avec Spring Boot (Backend) et MySQL pour la gestion des stages à l’étranger.

Le système permet :

La gestion des stagiaires

La gestion des entreprises

La création et le suivi des stages

La gestion des frais

Le dépôt et la validation des rapports

La consultation des statistiques

Ce projet a été réalisé dans le cadre d’un Projet de Fin d’Études (PFE).

🏗️ Architecture Technique
🔹 Backend

Java 17

Spring Boot 4

Spring Data JPA

Hibernate

MySQL

Maven

🔹 Base de données

MySQL 8

Gestion automatique via JPA

👥 Acteurs du Système
Acteur	Rôle
Administrateur	Gère les entreprises, utilisateurs et statistiques
Utilisateur	Gère les stages et stagiaires
Validateur	Valide ou rejette les rapports
📊 Diagramme de Cas d’Utilisation

🧱 Diagramme de Classes

🔄 Diagramme de Séquence

🗃️ Modèle de Données
Entités principales :

Entreprise

Utilisateur

Stage

Stagiaire

Frais

RapportStage

Relations :

Une entreprise possède plusieurs stages

Un stage contient plusieurs stagiaires

Un stage contient plusieurs frais

Un stagiaire possède un rapport

Un validateur valide ou rejette le rapport
