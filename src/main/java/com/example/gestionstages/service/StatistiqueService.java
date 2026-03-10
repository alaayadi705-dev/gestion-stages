package com.example.gestionstages.service;

import com.example.gestionstages.dto.StatistiqueDTO;
import com.example.gestionstages.repository.StageRepository;
import com.example.gestionstages.repository.FraisRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatistiqueService {

    private final StageRepository stageRepository;
    private final FraisRepository fraisRepository;

    public StatistiqueService(StageRepository stageRepository,
                              FraisRepository fraisRepository) {
        this.stageRepository = stageRepository;
        this.fraisRepository = fraisRepository;
    }

    public List<StatistiqueDTO> getStatistiquesParPays() {

        return stageRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(s -> s.getPays()))
                .entrySet()
                .stream()
                .map(entry -> {

                    String pays = entry.getKey();

                    long nombreStages = entry.getValue().size();

                    double coutTotal =
                            fraisRepository.findAll()
                            .stream()
                            .filter(f -> f.getStage().getPays().equals(pays))
                            .mapToDouble(f -> f.getMontant())
                            .sum();

                    return new StatistiqueDTO(
                            pays,
                            nombreStages,
                            nombreStages,
                            coutTotal
                    );

                })
                .collect(Collectors.toList());
    }

}