# Analysis Job Processor Pipeline Stages (`analysis.job.ts`)

```
[ STAGE 1: FETCH_USER_DATA ] (0% - 20%)
         |
         v
[ STAGE 2: COMPILE_METRICS ] (20% - 40%)
         |
         v
[ STAGE 3: GEMINI_GENERATION ] (40% - 80%)
         |
         v
[ STAGE 4: VALIDATE_&_PERSIST ] (80% - 100%)
```

Each stage updates the BullMQ job progress counter (`job.updateProgress(percent)`), allowing client frontends to render real-time progress indicators.
