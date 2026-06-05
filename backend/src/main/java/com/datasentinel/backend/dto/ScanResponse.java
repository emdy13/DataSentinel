package com.datasentinel.backend.dto;

import java.util.List;
import java.util.Map;

public class ScanResponse {

    private String fileName;
    private String fileSize;
    private String fileType;
    private int riskScore;
    private String riskLevel;
    
    // Répartition des menaces par type
    private Map<String, Integer> detectedFields;
    
    // Échantillon d'adresses compromises trouvées pour Breach Intel
    private List<String> uniqueEmails;
    
    // Statut de conformité par rapport à la loi sénégalaise n° 2008-12
    private boolean isCdpCompliant;
    private String cdpRecommendation;

    // Constructeurs
    public ScanResponse() {}

    public ScanResponse(String fileName, String fileSize, String fileType, int riskScore, String riskLevel,
                        Map<String, Integer> detectedFields, List<String> uniqueEmails, boolean isCdpCompliant,
                        String cdpRecommendation) {
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.detectedFields = detectedFields;
        this.uniqueEmails = uniqueEmails;
        this.isCdpCompliant = isCdpCompliant;
        this.cdpRecommendation = cdpRecommendation;
    }

    // Getters et Setters
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

    public Map<String, Integer> getDetectedFields() { return detectedFields; }
    public void setDetectedFields(Map<String, Integer> detectedFields) { this.detectedFields = detectedFields; }

    public List<String> getUniqueEmails() { return uniqueEmails; }
    public void setUniqueEmails(List<String> uniqueEmails) { this.uniqueEmails = uniqueEmails; }

    public boolean isCdpCompliant() { return isCdpCompliant; }
    public void setCdpCompliant(boolean cdpCompliant) { isCdpCompliant = cdpCompliant; }

    public String getCdpRecommendation() { return cdpRecommendation; }
    public void setCdpRecommendation(String cdpRecommendation) { this.cdpRecommendation = cdpRecommendation; }
}
