# Gemini AI Latency Profiles & Optimization

## Model Comparison Benchmarks
- `gemini-1.5-flash`: Average response time `950ms` (Ideal for fast interactive tasks).
- `gemini-1.5-pro`: Average response time `3,400ms` (Used for multi-repository architectural analysis).

## Optimization Techniques
- Context pruning: Stripping redundant git diffs before prompt assembly reduces input tokens by 60%.
- Strict temperature: `0.2` ensures deterministic, fast token generation without wandering.
