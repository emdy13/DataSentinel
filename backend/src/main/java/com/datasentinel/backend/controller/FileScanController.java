package com.datasentinel.backend.controller;

import com.datasentinel.backend.dto.ScanResponse;
import com.datasentinel.backend.entity.AuditLog;
import com.datasentinel.backend.repository.AuditLogRepository;
import com.datasentinel.backend.service.FileAnalyzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.util.List;

@RestController
@RequestMapping("/api/scan")
@CrossOrigin(origins = "*") // Autorise les requêtes Cross-Origin depuis le front Vite
public class FileScanController {

    private final FileAnalyzerService fileAnalyzerService;
    private final AuditLogRepository auditLogRepository;

    @Autowired
    public FileScanController(FileAnalyzerService fileAnalyzerService, AuditLogRepository auditLogRepository) {
        this.fileAnalyzerService = fileAnalyzerService;
        this.auditLogRepository = auditLogRepository;
    }

    @PostConstruct
    public void initDemoData() {
        // Ensemencement de la base H2 si elle est vide pour la démo du jury
        if (auditLogRepository.count() == 0) {
            auditLogRepository.save(new AuditLog("base_clients_2024.csv", "2.4 MB", "CSV", 91, "CRITICAL"));
            auditLogRepository.save(new AuditLog("employes_RH.xlsx", "845 KB", "XLSX", 74, "HIGH"));
            auditLogRepository.save(new AuditLog("factures_fournisseurs.pdf", "1.1 MB", "PDF", 45, "MEDIUM"));
        }
    }

    @PostMapping
    public ResponseEntity<ScanResponse> uploadAndAnalyzeFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Appel du service d'analyse
        ScanResponse response = fileAnalyzerService.analyzeFile(file);

        // Sauvegarde réelle dans notre base de données H2 via JPA
        AuditLog log = new AuditLog(
            response.getFileName(),
            response.getFileSize(),
            response.getFileType(),
            response.getRiskScore(),
            response.getRiskLevel()
        );
        
        // Renseigner les détails de détection
        if (response.getDetectedFields() != null) {
            log.setEmailCount(response.getDetectedFields().getOrDefault("emails", 0));
            log.setPhoneCount(response.getDetectedFields().getOrDefault("phones", 0));
            log.setWaveCount(response.getDetectedFields().getOrDefault("waveMoney", 0));
            log.setBankingCount(response.getDetectedFields().getOrDefault("banking", 0));
            log.setIdentityCount(response.getDetectedFields().getOrDefault("identity", 0));
            log.setNineaCount(response.getDetectedFields().getOrDefault("ninea", 0));
        }

        auditLogRepository.save(log);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }
}
