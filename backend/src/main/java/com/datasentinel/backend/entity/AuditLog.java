package com.datasentinel.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    private String fileSize;
    private String fileType;
    private int riskScore;
    private String riskLevel;

    // Compteurs de détection
    private int emailCount;
    private int phoneCount;
    private int bankingCount;
    private int identityCount;
    private int nineaCount;
    private int waveCount;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    // Constructeurs
    public AuditLog() {
        this.uploadedAt = LocalDateTime.now();
    }

    public AuditLog(String fileName, String fileSize, String fileType, int riskScore, String riskLevel) {
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public int getEmailCount() { return emailCount; }
    public void setEmailCount(int emailCount) { this.emailCount = emailCount; }

    public int getPhoneCount() { return phoneCount; }
    public void setPhoneCount(int phoneCount) { this.phoneCount = phoneCount; }

    public int getBankingCount() { return bankingCount; }
    public void setBankingCount(int bankingCount) { this.bankingCount = bankingCount; }

    public int getIdentityCount() { return identityCount; }
    public void setIdentityCount(int identityCount) { this.identityCount = identityCount; }

    public int getNineaCount() { return nineaCount; }
    public void setNineaCount(int nineaCount) { this.nineaCount = nineaCount; }

    public int getWaveCount() { return waveCount; }
    public void setWaveCount(int waveCount) { this.waveCount = waveCount; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
