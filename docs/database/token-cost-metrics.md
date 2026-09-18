# AI Token Consumption & Cost Formulas

## Cost Modeling by Gemini Model Tier

| Model | Input Price / 1M Tokens | Output Price / 1M Tokens |
|-------|--------------------------|---------------------------|
| `gemini-1.5-flash` | $0.075 | $0.30 |
| `gemini-1.5-pro` | $1.25 | $5.00 |

## Calculation Formula
```typescript
const promptCost = (promptTokens / 1_000_000) * inputRate;
const completionCost = (completionTokens / 1_000_000) * outputRate;
const totalCostUSD = promptCost + completionCost;
```
