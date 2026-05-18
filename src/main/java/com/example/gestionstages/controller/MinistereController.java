package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Ministere;
import com.example.gestionstages.repository.MinistereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ministeres")
@CrossOrigin(origins = "*")
public class MinistereController {

    @Autowired
    private MinistereRepository ministereRepository;

    @GetMapping
    public List<Ministere> getAll() {
        return ministereRepository.findAll();
    }

    @PostMapping
    public Ministere create(@RequestBody Ministere m) {
        return ministereRepository.save(m);
    }

    @PutMapping("/{id}")
    public Ministere update(@PathVariable Long id, @RequestBody Ministere m) {
        m.setId(id);
        return ministereRepository.save(m);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ministereRepository.deleteById(id);
    }
}
