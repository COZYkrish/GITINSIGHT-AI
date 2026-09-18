# AI Token Tracker Service (`tokenTracker.ts`)

Accurately attributes token usage to each user and feature invocation.

## Metrics Recorded
- `promptTokens`: Count of input tokens processed
- `candidatesTokens`: Count of completion tokens generated
- `totalTokens`: Combined token volume
- `executionTime`: Roundtrip latency in milliseconds

## Persistence
Every completion call automatically fires an asynchronous record save to the MongoDB `aiusages` collection without blocking the user response stream.
