# Prompt Specification: Developer DNA (`developerDNA.prompt.ts`)

## Input Payload
- Aggregated user repository summary (names, languages, star counts, commit frequencies)
- Top 5 repositories by activity
- Overall language breakdown

## Expected JSON Schema
```json
{
  "archetype": "Architect | Speed Demon | Craftsman | Explorer | Specialist",
  "confidence": 0.92,
  "summary": "String",
  "radarScores": {
    "codeQuality": 85,
    "consistency": 90,
    "architecture": 88,
    "velocity": 78,
    "collaboration": 82
  },
  "keyStrengths": ["String"],
  "signatureTraits": ["String"]
}
```
