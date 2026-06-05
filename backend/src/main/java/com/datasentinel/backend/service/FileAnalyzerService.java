package com.datasentinel.backend.service;

import com.datasentinel.backend.dto.ScanResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FileAnalyzerService {

    // Regex définies pour correspondre parfaitement à l'ancrage sénégalais et aux fuites
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?:\\+221\\s?)?(?:(?:77|78|70|76|75|33)\\s?(?:\\d{3}\\s?\\d{2}\\s?\\d{2}|\\d{7}))|\\+\\d{1,3}[\\s\\-]?\\d{6,12}");
    private static final Pattern WAVE_OM_PATTERN = Pattern.compile("\\b(?:\\+221\\s?)?7[0-8]\\d{7}\\b");
    private static final Pattern BANKING_PATTERN = Pattern.compile("(?:[0-9]{4}[\\s\\-]?){3}[0-9]{4}|SN\\d{2}[A-Z0-9]{20,30}");
    private static final Pattern IDENTITY_CNI_PATTERN = Pattern.compile("\\b[0-9]{9,12}\\b");
    private static final Pattern NINEA_PATTERN = Pattern.compile("SN\\d{9}|\\b\\d{7}[A-Z]\\d[A-Z]\\b", Pattern.CASE_INSENSITIVE);

    public ScanResponse analyzeFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String fileType = getExtension(fileName).toUpperCase();
        String fileSize = formatSize(file.getSize());

        Map<String, Integer> detectedFields = new HashMap<>();
        detectedFields.put("emails", 0);
        detectedFields.put("phones", 0);
        detectedFields.put("waveMoney", 0);
        detectedFields.put("banking", 0);
        detectedFields.put("identity", 0);
        detectedFields.put("ninea", 0);

        List<String> uniqueEmails = new ArrayList<>();
        Set<String> emailSet = new HashSet<>();

        try {
            // Lecture du fichier (simulé par lecture ligne à ligne pour TXT/CSV/JSON)
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
            String line;
            StringBuilder fullText = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                fullText.append(line).append("\n");
            }
            String content = fullText.toString();

            // Comptage des occurrences par Regex
            detectedFields.put("emails", countMatches(EMAIL_PATTERN, content, emailSet));
            detectedFields.put("phones", countMatches(PHONE_PATTERN, content, null));
            detectedFields.put("waveMoney", countMatches(WAVE_OM_PATTERN, content, null));
            detectedFields.put("banking", countMatches(BANKING_PATTERN, content, null));
            detectedFields.put("identity", countMatches(IDENTITY_CNI_PATTERN, content, null));
            detectedFields.put("ninea", countMatches(NINEA_PATTERN, content, null));

            // Récupérer un échantillon d'emails uniques
            int limit = 0;
            for (String email : emailSet) {
                if (limit >= 5) break;
                uniqueEmails.add(email);
                limit++;
            }

        } catch (Exception e) {
            // Log d'erreur ou traitement par défaut
            System.err.println("Erreur lors de l'analyse du fichier : " + e.getMessage());
        }

        // Calcul du score de risque
        int riskScore = calculateRiskScore(detectedFields);
        String riskLevel = getRiskLevel(riskScore);
        
        // Conformité Loi n° 2008-12
        boolean isCdpCompliant = riskScore < 40;
        String cdpRecommendation = isCdpCompliant 
            ? "Conforme aux exigences générales de sécurité."
            : "Non-conforme. Présence de données d'identification ou bancaires en clair sans déclaration ni chiffrement AES-256 (Loi n° 2008-12).";

        return new ScanResponse(fileName, fileSize, fileType, riskScore, riskLevel, detectedFields, uniqueEmails, isCdpCompliant, cdpRecommendation);
    }

    private int countMatches(Pattern pattern, String text, Set<String> captureSet) {
        Matcher matcher = pattern.matcher(text);
        int count = 0;
        while (matcher.find()) {
            count++;
            if (captureSet != null) {
                captureSet.add(matcher.group().toLowerCase());
            }
        }
        return count;
    }

    private int calculateRiskScore(Map<String, Integer> fields) {
        double raw = 0;
        raw += fields.get("banking") > 0 ? 40 : 0;
        raw += fields.get("identity") > 0 ? 35 : 0;
        raw += fields.get("ninea") > 0 ? 25 : 0;
        raw += fields.get("waveMoney") > 0 ? 20 : 0;
        raw += fields.get("emails") > 0 ? 15 : 0;
        raw += fields.get("phones") > 0 ? 10 : 0;
        return (int) Math.min(100, Math.round(raw));
    }

    private String getRiskLevel(int score) {
        if (score >= 75) return "CRITICAL";
        if (score >= 50) return "HIGH";
        if (score >= 25) return "MEDIUM";
        return "LOW";
    }

    private String getExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "TXT";
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format(Locale.US, "%.1f %cB", bytes / Math.pow(1024, exp), pre);
    }
}
