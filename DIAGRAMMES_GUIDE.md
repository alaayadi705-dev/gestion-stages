# 📊 Guide d'Utilisation des Diagrammes - Projet PFE

## 📁 Fichiers Disponibles

| Fichier | Type | Description |
|---------|------|-------------|
| `diagrammes_projet.md` | Markdown + Mermaid | **5 diagrammes complets** avec descriptions |
| `use_case.puml` | PlantUML | Diagramme de Cas d'Utilisation |
| `class_diagram.puml` | PlantUML | Diagramme de Classes complet |
| `database_schema.sql` | SQL | Schéma de base de données avec index et vues |

---

## 🎯 Diagrammes Inclus

### 1. ✅ Use Case Diagram (Cas d'Utilisation)
- **Acteurs**: Admin, Gestionnaire, Validateur
- **20 Use Cases** détaillés
- Relations `<<include>>` identifiées
- Description complète de chaque cas

### 2. ✅ Class Diagram (Diagramme de Classes)
- **7 Entités principales**: Utilisateur, Ministere, Entreprise, Stage, Stagiaire, Frais, RapportStage
- **Controllers**: StagiaireController, StageController, RapportStageController
- **Services**: Business logic layer
- **Repositories**: Data access layer
- Relations complètes (1-N, 1-1)
- Notes explicatives sur les méthodes spéciales

### 3. ✅ Sequence Diagram (Diagramme de Séquence)
- **Scénario**: Validation de rapport de stage
- **6 participants**: Validateur, Frontend, Backend API, Service, Database, Email
- **Flux complet**: Consultation → Sélection → Validation → Notification
- Messages synchrones et asynchrones

### 4. ✅ Database Schema (Schéma BD)
- **7 tables** avec types de données
- **Clés primaires et étrangères**
- **Index** pour l'optimisation
- **3 vues** utiles pour les statistiques
- **Trigger** pour génération automatique N° permission
- **Procédure stockée** pour calcul de durée
- **Données de test**

### 5. ✅ Architecture Globale
- **3-Tier Architecture**: Frontend, Backend, Database
- **Technologies** détaillées par tier
- **Flux de données** complet
- **Services externes**: SMTP, GitHub

---

## 🛠️ Comment Générer les Images

### OPTION 1: Mermaid Live Editor (RECOMMANDÉ - Gratuit)

**Pour les diagrammes dans `diagrammes_projet.md`:**

1. **Aller sur**: https://mermaid.live/
2. **Copier** le code Mermaid du diagramme souhaité
3. **Coller** dans l'éditeur en ligne
4. **Télécharger** en PNG, SVG ou PDF
5. **Insérer** dans votre mémoire Word/LaTeX

**Avantages**:
- ✅ Gratuit
- ✅ Pas d'installation
- ✅ Export haute qualité
- ✅ Personnalisation des couleurs

---

### OPTION 2: PlantUML (Pour fichiers .puml)

**Installation:**

**Windows:**
```bash
# Installer Chocolatey si pas encore fait
choco install plantuml

# OU télécharger le JAR
# https://plantuml.com/download
```

**Générer les images:**
```bash
# Use Case
java -jar plantuml.jar use_case.puml

# Class Diagram
java -jar plantuml.jar class_diagram.puml

# Génère: use_case.png, class_diagram.png
```

**VS Code Extension:**
1. Installer: "PlantUML" par jebbs
2. Ouvrir fichier .puml
3. `Alt + D` pour preview
4. Bouton d'export en haut à droite

---

### OPTION 3: Online PlantUML

1. **Aller sur**: https://www.plantuml.com/plantuml/uml/
2. **Coller** le contenu du fichier .puml
3. **Voir** le diagramme généré
4. **Télécharger** PNG/SVG

---

### OPTION 4: Draw.io (diagrams.net)

**Pour recréer manuellement avec personnalisation:**

1. **Aller sur**: https://app.diagrams.net/
2. **Choisir** le type de diagramme
3. **Recréer** en suivant les diagrammes fournis
4. **Personnaliser** couleurs, styles, polices
5. **Exporter** en PNG, SVG, PDF

**Avantages**:
- ✅ Contrôle total sur le design
- ✅ Couleurs personnalisées
- ✅ Styles professionnels
- ✅ Export multiple formats

---

## 📐 Intégration dans le Mémoire

### Pour LaTeX (memoire_pfe.tex):

```latex
% Use Case
\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{diagrammes/use_case.png}
\caption{Diagramme de cas d'utilisation}
\label{fig:usecase}
\end{figure}

% Class Diagram
\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{diagrammes/class_diagram.png}
\caption{Diagramme de classes}
\label{fig:class}
\end{figure}

% Sequence Diagram
\begin{figure}[H]
\centering
\includegraphics[width=0.95\textwidth]{diagrammes/sequence_diagram.png}
\caption{Diagramme de séquence - Validation de rapport}
\label{fig:sequence}
\end{figure}

% Database Schema
\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{diagrammes/database_schema.png}
\caption{Schéma de la base de données}
\label{fig:database}
\end{figure}

% Architecture
\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{diagrammes/architecture.png}
\caption{Architecture globale du système}
\label{fig:architecture}
\end{figure}
```

### Pour Word:

1. **Générer** les images PNG/SVG
2. **Word** > Insertion > Images
3. **Redimensionner** si nécessaire
4. **Ajouter** une légende: Clic droit > Insérer légende
5. **Format**: Centré, habillage "Haut et bas"

---

## 🎨 Personnalisation des Couleurs

### Mermaid (dans diagrammes_projet.md):

```mermaid
%% Ajouter au début du diagramme:
%%{init: {'theme': 'base', 'themeVariables': { 
    'primaryColor': '#e1f5ff',
    'primaryTextColor': '#000',
    'primaryBorderColor': '#0066cc',
    'lineColor': '#666',
    'secondaryColor': '#fff4e1',
    'tertiaryColor': '#ffe1e1'
}}}%%
```

### PlantUML (dans fichiers .puml):

```plantuml
skinparam backgroundColor #f5f5f5
skinparam shadowing false
skinparam roundcorner 10

skinparam class {
    BackgroundColor #e1f5ff
    BorderColor #0066cc
    ArrowColor #333
}

skinparam usecase {
    BackgroundColor #fff4e1
    BorderColor #cc6600
}
```

---

## 📊 Détails Techniques par Diagramme

### 1. Use Case Diagram

**Acteurs:**
- 👨‍💼 **Administrateur**: Gestion complète du système
- 👨‍🎓 **Gestionnaire**: Opérations quotidiennes sur stages/stagiaires
- 🧑‍🏫 **Validateur**: Validation/rejet des rapports

**Use Cases Critiques:**
- UC17: Génération auto N° permission (format: AA/NNNNNNN/1)
- UC18: Calcul durée stage (ChronoUnit.DAYS.between)
- UC19: Calcul total frais (SUM par stage)

---

### 2. Class Diagram

**Entités Principales:**

| Classe | Table | Attributs Clés | Relations |
|--------|-------|----------------|-----------|
| Utilisateur | utilisateurs | email, password, role | 1-N Stagiaire |
| Stage | stages | dateDebut, dateFin, pays | 1-N Stagiaire, Frais, Rapport |
| Stagiaire | stagiaires | numeroPermission, statut | N-1 Stage, 1-1 Rapport |
| RapportStage | rapport_stage | statut, dateDepot | N-1 Stagiaire, Stage |

**Méthodes Spéciales:**
- `Stagiaire.generateNumeroPermission()`: @PrePersist
- `Stage.getDuree()`: Calcul automatique en jours

---

### 3. Sequence Diagram

**Scénario**: Validation Rapport de Stage

**Participants:**
1. Validateur (Actor)
2. Frontend React (UI)
3. Backend API (Controller)
4. RapportService (Service Layer)
5. MySQL Database (Data Layer)
6. EmailService (Notification)

**Messages:**
- Synchrone: `→` (attente réponse)
- Asynchrone: `→` (pas d'attente)
- Retour: `-->>` (réponse)

---

### 4. Database Schema

**Tables et Relations:**

```
ministeres (1) ───< (N) entreprise
ministeres (1) ───< (N) utilisateurs
entreprise (1) ───< (N) stages
stages (1) ───< (N) stagiaires
stages (1) ───< (N) frais
stages (1) ───< (N) rapport_stage
stagiaires (1) ───< (1) rapport_stage
utilisateurs (1) ───< (N) stagiaires
```

**Index Stratégiques:**
- `idx_email` sur utilisateurs, stagiaires
- `idx_statut` sur stages, rapport_stage
- `idx_stage_statut_pays` composé
- `idx_rapport_statut_date` composé

**Vues:**
- `v_statistiques_pays`: Stats par pays
- `v_rapports_en_attente`: Rapports à valider
- `v_frais_par_stage`: Budget vs dépenses

---

### 5. Architecture Globale

**3-Tier Architecture:**

```
┌─────────────────────────────────────┐
│     CLIENT TIER (Frontend)          │
│  React 18 | Port 3000               │
│  Router | AuthContext | Axios       │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│     APPLICATION TIER (Backend)      │
│  Spring Boot 4 | Port 8080          │
│  Security | JWT | Controllers       │
└──────────────┬──────────────────────┘
               │ JDBC/Hibernate
┌──────────────▼──────────────────────┐
│       DATA TIER (Database)          │
│  MySQL 8.0 | Port 3306              │
│  7 Tables | HikariCP Pool           │
└─────────────────────────────────────┘
```

---

## 📝 Notes Importantes

### Pour le Mémoire:

1. **Résolution**: Exporter en **300 DPI minimum** pour l'impression
2. **Format**: **PNG** pour images, **SVG** pour vectoriel (meilleure qualité)
3. **Taille**: Ajuster pour ne pas dépasser **1 page par diagramme**
4. **Légendes**: Toujours ajouter figure number et description
5. **Références**: Citer les diagrammes dans le texte (ex: "voir Figure 1")

### Emplacement dans le Mémoire LaTeX:

- **Use Case**: Chapitre 1 ou 2
- **Class Diagram**: Chapitre 2 (Analyse)
- **Sequence Diagram**: Chapitre 3 (Sprint détaillé)
- **Database Schema**: Chapitre 2 (Architecture)
- **Architecture**: Chapitre 2 (Choix techniques)

---

## 🔗 Liens Utiles

- **Mermaid Live**: https://mermaid.live/
- **PlantUML Online**: https://www.plantuml.com/plantuml/uml/
- **Draw.io**: https://app.diagrams.net/
- **PlantUML Download**: https://plantuml.com/download
- **Mermaid Documentation**: https://mermaid.js.org/

---

## ✅ Checklist pour le Mémoire

- [ ] Générer les 5 diagrammes en haute qualité
- [ ] Insérer dans le document Word/LaTeX
- [ ] Ajouter légendes et numéros de figure
- [ ] Référencer dans le texte
- [ ] Vérifier la lisibilité après impression
- [ ] Mettre à jour la liste des figures
- [ ] Vérifier la cohérence avec le code source

---

## 📞 Support

Si vous avez des questions sur les diagrammes:
- **Email**: alaayadi705-dev (GitHub)
- **Repository**: https://github.com/alaayadi705-dev/gestion-stages

---

**Auteur**: Ayadi Ala Eddine  
**Projet**: Système de Gestion des Stages à l'Étranger  
**PFE License Informatique 2025-2026**  
**Université de Kairouan - FST Sidi Bouzid**
