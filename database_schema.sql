-- ============================================
-- Schéma de Base de Données
-- Système de Gestion des Stages à l'Étranger
-- Ayadi Ala Eddine - PFE 2026
-- ============================================

CREATE DATABASE IF NOT EXISTS gestion_stages;
USE gestion_stages;

-- ============================================
-- Table: MINISTERES
-- ============================================
CREATE TABLE ministeres (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: UTILISATEURS
-- ============================================
CREATE TABLE utilisateurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cin VARCHAR(20) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    cnrps_cnss VARCHAR(50),
    nationalite VARCHAR(50),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    rib VARCHAR(30),
    fonction VARCHAR(100),
    grade VARCHAR(50),
    niveau_retard VARCHAR(50),
    categorie VARCHAR(50),
    groupe VARCHAR(50),
    poste VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'UTILISATEUR', 'VALIDATEUR')),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    etat BOOLEAN DEFAULT TRUE,
    reset_code VARCHAR(10),
    reset_code_expiry TIMESTAMP,
    ministere_id BIGINT,
    
    FOREIGN KEY (ministere_id) REFERENCES ministeres(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_ministere (ministere_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: ENTREPRISE
-- ============================================
CREATE TABLE entreprise (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    email VARCHAR(100),
    telephone VARCHAR(30),
    ministere_id BIGINT,
    
    FOREIGN KEY (ministere_id) REFERENCES ministeres(id) ON DELETE SET NULL,
    INDEX idx_nom (nom),
    INDEX idx_ministere (ministere_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: STAGES
-- ============================================
CREATE TABLE stages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    intitule VARCHAR(255) NOT NULL,
    objectifs TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    pays VARCHAR(100) NOT NULL,
    type_stage VARCHAR(50),
    statut VARCHAR(30) DEFAULT 'PLANIFIE' CHECK (statut IN ('PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE')),
    budget_propose DOUBLE,
    entreprise_id BIGINT,
    
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE,
    INDEX idx_statut (statut),
    INDEX idx_pays (pays),
    INDEX idx_dates (date_debut, date_fin),
    INDEX idx_entreprise (entreprise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: STAGIAIRES
-- ============================================
CREATE TABLE stagiaires (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    nationalite VARCHAR(50),
    pays_residence VARCHAR(100),
    universite VARCHAR(200),
    specialite VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(30),
    grade VARCHAR(50),
    fonction VARCHAR(100),
    statut VARCHAR(30) DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'TERMINE', 'ANNULE')),
    numero_permission VARCHAR(20) UNIQUE,
    stage_id BIGINT,
    entreprise_id BIGINT,
    user_id BIGINT,
    
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE SET NULL,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_statut (statut),
    INDEX idx_stage (stage_id),
    INDEX idx_permission (numero_permission),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: FRAIS
-- ============================================
CREATE TABLE frais (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_frais VARCHAR(50) NOT NULL,
    montant DOUBLE NOT NULL,
    devise VARCHAR(10) DEFAULT 'TND',
    support VARCHAR(100),
    stage_id BIGINT NOT NULL,
    
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE,
    INDEX idx_type (type_frais),
    INDEX idx_stage (stage_id),
    CHECK (montant >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: RAPPORT_STAGE
-- ============================================
CREATE TABLE rapport_stage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    fichier VARCHAR(500),
    statut VARCHAR(20) DEFAULT 'EN_ATTENTE' CHECK (statut IN ('EN_ATTENTE', 'VALIDE', 'REFUSE')),
    date_depot DATE NOT NULL,
    commentaires TEXT,
    date_validation DATE,
    stagiaire_id BIGINT,
    stage_id BIGINT,
    
    FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id) ON DELETE CASCADE,
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE,
    INDEX idx_statut (statut),
    INDEX idx_date_depot (date_depot),
    INDEX idx_stagiaire (stagiaire_id),
    INDEX idx_stage (stage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- VIEWS UTILES
-- ============================================

-- Vue: Statistiques par pays
CREATE OR REPLACE VIEW v_statistiques_pays AS
SELECT 
    s.pays,
    COUNT(DISTINCT st.id) as nombre_stagiaires,
    COUNT(DISTINCT s.id) as nombre_stages,
    SUM(f.montant) as total_frais,
    AVG(s.budget_propose) as budget_moyen
FROM stages s
LEFT JOIN stagiaires st ON s.id = st.stage_id
LEFT JOIN frais f ON s.id = f.stage_id
GROUP BY s.pays;

-- Vue: Rapports en attente
CREATE OR REPLACE VIEW v_rapports_en_attente AS
SELECT 
    r.id,
    r.titre,
    r.date_depot,
    st.nom as stagiaire_nom,
    st.prenom as stagiaire_prenom,
    s.intitule as stage_intitule,
    s.pays as stage_pays
FROM rapport_stage r
JOIN stagiaires st ON r.stagiaire_id = st.id
JOIN stages s ON r.stage_id = s.id
WHERE r.statut = 'EN_ATTENTE';

-- Vue: Frais totaux par stage
CREATE OR REPLACE VIEW v_frais_par_stage AS
SELECT 
    s.id as stage_id,
    s.intitule as stage_intitule,
    s.budget_propose,
    SUM(f.montant) as total_frais,
    s.budget_propose - SUM(f.montant) as reste_budget,
    COUNT(f.id) as nombre_frais
FROM stages s
LEFT JOIN frais f ON s.id = f.stage_id
GROUP BY s.id, s.intitule, s.budget_propose;

-- ============================================
-- DONNÉES DE TEST
-- ============================================

INSERT INTO ministeres (nom) VALUES
('Ministère de l\'Enseignement Supérieur'),
('Ministère de l\'Industrie'),
('Ministère de la Santé'),
('Ministère de l\'Éducation');

INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES
('Admin', 'System', 'admin@gestionstages.tn', '$2a$10$...', 'ADMIN'),
('Gestionnaire', 'Stage', 'user@gestionstages.tn', '$2a$10$...', 'UTILISATEUR'),
('Validateur', 'Rapport', 'validator@gestionstages.tn', '$2a$10$...', 'VALIDATEUR');

INSERT INTO entreprise (nom, adresse, email, telephone) VALUES
('TechCorp France', 'Paris, France', 'contact@techcorp.fr', '+33123456789'),
('InnoTech Germany', 'Berlin, Germany', 'info@innotech.de', '+49123456789'),
('DataSoft Canada', 'Montreal, Canada', 'hello@datasoft.ca', '+1123456789');

-- ============================================
-- TRIGGER: Génération automatique numéro permission
-- ============================================
DELIMITER //
CREATE TRIGGER before_stagiaire_insert
BEFORE INSERT ON stagiaires
FOR EACH ROW
BEGIN
    IF NEW.numero_permission IS NULL OR NEW.numero_permission = '' THEN
        SET NEW.numero_permission = CONCAT(
            RIGHT(YEAR(CURDATE()), 2),
            '/',
            LPAD(FLOOR(RAND() * 9000000) + 1000000, 7, '0'),
            '/1'
        );
    END IF;
END//
DELIMITER ;

-- ============================================
-- PROCÉDURE STOCKÉE: Calculer durée stage
-- ============================================
DELIMITER //
CREATE PROCEDURE calculer_duree_stage(
    IN p_stage_id BIGINT,
    OUT p_duree INT
)
BEGIN
    SELECT DATEDIFF(date_fin, date_debut)
    INTO p_duree
    FROM stages
    WHERE id = p_stage_id;
END//
DELIMITER ;

-- ============================================
-- INDEX COMPOSÉS POUR OPTIMISATION
-- ============================================
CREATE INDEX idx_stage_statut_pays ON stages(statut, pays);
CREATE INDEX idx_stagiaire_stage_statut ON stagiaires(stage_id, statut);
CREATE INDEX idx_rapport_statut_date ON rapport_stage(statut, date_depot);

-- ============================================
-- STATISTIQUES
-- ============================================
SELECT 
    'MINISTERES' as table_name,
    COUNT(*) as nombre_records 
FROM ministeres
UNION ALL
SELECT 'UTILISATEURS', COUNT(*) FROM utilisateurs
UNION ALL
SELECT 'ENTREPRISES', COUNT(*) FROM entreprise
UNION ALL
SELECT 'STAGES', COUNT(*) FROM stages
UNION ALL
SELECT 'STAGIAIRES', COUNT(*) FROM stagiaires
UNION ALL
SELECT 'FRAIS', COUNT(*) FROM frais
UNION ALL
SELECT 'RAPPORTS', COUNT(*) FROM rapport_stage;
