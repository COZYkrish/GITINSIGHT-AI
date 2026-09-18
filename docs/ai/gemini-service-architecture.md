# Gemini AI Service Architecture (`gemini.service.ts`)

The AI subsystem interfaces directly with the Google Generative AI SDK (`@google/generative-ai`).

## Service Responsibilities
1. **SDK Initialization**: Singleton GoogleGenerativeAI client initialized with `GEMINI_API_KEY`.
2. **Model Selection Strategy**:
   - `gemini-1.5-flash`: Fast, low-latency generation for concise tasks (README reviews, LinkedIn posts).
   - `gemini-1.5-pro`: High reasoning depth for complex tasks (Developer DNA, Recruiter Reports, Career Readiness).
3. **Structured Outputs**: Directs models to respond in pure JSON without conversational preambles.
