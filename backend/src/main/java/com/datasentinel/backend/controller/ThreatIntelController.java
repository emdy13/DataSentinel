package com.datasentinel.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/threats")
@CrossOrigin(origins = "*")
public class ThreatIntelController {

    private final List<Map<String, Object>> cveDb = new ArrayList<>();
    private final List<Map<String, Object>> darkWebAlerts = new ArrayList<>();

    public ThreatIntelController() {
        // Ensemencement des CVEs simulées
        cveDb.add(createCve(1, "WordPress", "6.2", "CVE-2023-32243", "Exécution de Code à Distance (RCE)", 9.8, "critical"));
        cveDb.add(createCve(2, "WordPress", "6.2", "CVE-2023-27635", "Cross-Site Scripting (XSS)", 7.2, "high"));
        cveDb.add(createCve(3, "WooCommerce", "7.4", "CVE-2023-28121", "Contournement d'Authentification", 9.8, "critical"));
        cveDb.add(createCve(4, "phpMyAdmin", "5.1", "CVE-2022-23808", "Injection SQL", 8.8, "high"));

        // Ensemencement des alertes du Dark Web
        darkWebAlerts.add(createDarkWebAlert(1, "datasentinel.sn", "BreachForums", "Base de données SQL présumée en vente pour 350$ en Bitcoin.", "critical"));
        darkWebAlerts.add(createDarkWebAlert(2, "datasentinel.sn", "Redline Stealer Logs", "Identifiants d'employés détectés dans des logs de malwares.", "critical"));
    }

    @GetMapping("/cve")
    public ResponseEntity<List<Map<String, Object>>> getCves() {
        return ResponseEntity.ok(cveDb);
    }

    @GetMapping("/darkweb")
    public ResponseEntity<List<Map<String, Object>>> getDarkWebAlerts() {
        return ResponseEntity.ok(darkWebAlerts);
    }

    @PostMapping("/cve/{id}/patch")
    public ResponseEntity<Map<String, String>> patchCve(@PathVariable int id) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "200");
        response.put("message", "Vulnérabilité " + id + " corrigée avec succès. Correctif appliqué.");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createCve(int id, String tech, String version, String cveCode, String title, double cvss, String dangerLevel) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("tech", tech);
        map.put("version", version);
        map.put("cveCode", cveCode);
        map.put("title", title);
        map.put("cvss", cvss);
        map.put("dangerLevel", dangerLevel);
        map.put("status", "ACTIVE");
        return map;
    }

    private Map<String, Object> createDarkWebAlert(int id, String domain, String source, String description, String dangerLevel) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("domain", domain);
        map.put("source", source);
        map.put("description", description);
        map.put("dangerLevel", dangerLevel);
        map.put("date", "2026-06-05");
        return map;
    }
}
