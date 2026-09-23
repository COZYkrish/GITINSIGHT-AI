# Prompt Versioning & Regression Testing Strategy

## Version Tagging Convention
Every prompt file defines a `PROMPT_VERSION` constant (e.g., `v1.2.0`). When modifying prompt instructions:
1. Increment prompt version.
2. Run test assertions against fixture repositories.
3. Validate that generated JSON conforms 100% to target Zod schemas.

## Fixture Datasets
Standard mock profiles (Beginner, Intermediate Full-Stack, Staff Systems Engineer) are executed to verify that scoring distributions remain normalized.
