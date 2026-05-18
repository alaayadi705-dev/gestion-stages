package com.example.gestionstages.repository;
import com.example.gestionstages.dto.StageDetailsDTO;

import com.example.gestionstages.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface StageRepository extends JpaRepository<Stage, Long> {

    // ===== COUNT =====
    long countByStatut(String statut);

    // ===== GROUP BY PAYS =====
    @Query("SELECT s.pays, COUNT(s) FROM Stage s GROUP BY s.pays")
    List<Object[]> countStagesByPays();

    // ===== FILTER SIMPLE =====

// filter by pays
List<Stage> findByPays(String pays);

// filter by date debut
List<Stage> findByDateDebutBetween(LocalDate start, LocalDate end);

// filter combiné (pays + date)
List<Stage> findByPaysAndDateDebutBetween(String pays, LocalDate start, LocalDate end);
// filter by ministere
List<Stage> findByEntrepriseMinistereNom(String ministere);

@Query("SELECT DISTINCT s FROM Stage s JOIN s.stagiaires st WHERE st.email = :email")
List<Stage> findByStagiaireEmail(@Param("email") String email);

@Query("SELECT DISTINCT s FROM Stage s JOIN s.stagiaires st JOIN st.utilisateur u WHERE LOWER(u.email) = LOWER(:email)")
List<Stage> findByUtilisateurLinkedEmail(@Param("email") String email);

    long countByEntrepriseMinistereNom(String ministere);

    long countByStatutAndEntrepriseMinistereNom(String statut, String ministere);

    @Query("SELECT s.pays, COUNT(s) FROM Stage s JOIN s.entreprise e JOIN e.ministere m WHERE m.nom = :ministere GROUP BY s.pays")
    List<Object[]> countStagesByPaysAndMinistere(@Param("ministere") String ministere);

    @Query("SELECT COUNT(DISTINCT s) FROM Stage s JOIN s.stagiaires st WHERE st.email = :email")
    long countByStagiaireEmail(@Param("email") String email);

    @Query("SELECT COUNT(DISTINCT s) FROM Stage s JOIN s.stagiaires st WHERE st.email = :email AND s.statut = :statut")
    long countByStatutAndStagiaireEmail(@Param("statut") String statut, @Param("email") String email);

    

   @Query("""
SELECT new com.example.gestionstages.dto.StageDetailsDTO(
    s.id,
    s.intitule,
    s.dateDebut,
    s.dateFin,
    CAST(FUNCTION('DATEDIFF', s.dateFin, s.dateDebut) AS long),
    s.pays,
    s.statut,
    COALESCE(st.nom, '---'),
    COALESCE(st.prenom, '---'),
    COALESCE(e.nom, '---'),
    COALESCE(SUM(f.montant), 0.0),
    s.typeStage,
    COALESCE(MAX(r.fichier), '---'),
    COALESCE(MAX(r.statut), '---')
)
FROM Stage s
LEFT JOIN s.stagiaires st
LEFT JOIN st.entreprise e
LEFT JOIN e.ministere m
LEFT JOIN Frais f ON f.stage.id = s.id
LEFT JOIN RapportStage r ON r.stage.id = s.id

WHERE (:id IS NULL OR s.id = :id)
AND (:pays IS NULL OR s.pays = :pays)
AND (:start IS NULL OR s.dateDebut >= :start)
AND (:end IS NULL OR s.dateFin <= :end)
AND (:ministere IS NULL OR m.nom = :ministere)

GROUP BY 
    s.id,
    s.intitule,
    s.dateDebut,
    s.dateFin,
    s.pays,
    s.statut,
    st.nom,
    st.prenom,
    e.nom
""")
List<StageDetailsDTO> searchFull(
        @Param("id") Long id,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end,
        @Param("pays") String pays,
        @Param("ministere") String ministere
);
    // ===== FILTER BY DATE =====
    @Query("SELECT s.pays, COUNT(s) FROM Stage s WHERE s.dateDebut >= :start AND s.dateFin <= :end GROUP BY s.pays")
    List<Object[]> filterByDate(@Param("start") LocalDate start,
                                @Param("end") LocalDate end);


    // ===== DISTRIBUTION BY DURATION =====
    @Query("""
    SELECT 
      CASE 
        WHEN DATEDIFF(s.dateFin, s.dateDebut) <= 30 THEN 'قصير'
        WHEN DATEDIFF(s.dateFin, s.dateDebut) <= 90 THEN 'متوسط'
        ELSE 'طويل'
      END,
      COUNT(s)
    FROM Stage s
    GROUP BY 
      CASE 
        WHEN DATEDIFF(s.dateFin, s.dateDebut) <= 30 THEN 'قصير'
        WHEN DATEDIFF(s.dateFin, s.dateDebut) <= 90 THEN 'متوسط'
        ELSE 'طويل'
      END
    """)
    List<Object[]> groupByDuree();

    // ===== DISTRIBUTION BY STATUS =====
    @Query("SELECT s.statut, COUNT(s) FROM Stage s GROUP BY s.statut")
    List<Object[]> groupByStatut();

    // ===== DISTRIBUTION BY TITLE =====
    @Query("SELECT s.intitule, COUNT(s) FROM Stage s GROUP BY s.intitule")
    List<Object[]> groupByTitre();
}