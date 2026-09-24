# Portfolio & Resume Job Processors (`portfolio.job.ts`, `resume.job.ts`)

## Portfolio Worker Workflow
1. Loads user's public repositories sorted by stars and commit counts.
2. Filters out fork repositories unless they contain significant original commits.
3. Invokes `portfolio.prompt.ts` to construct showcase summaries.
4. Generates vanity URL and writes `PortfolioScore` and `PublicProfile` documents.

## Resume Worker Workflow
1. Extracts top 5 demonstrated skills and associated technology stacks.
2. Generates bullet points highlighting measurable impact and metrics.
3. Saves to `GeneratedResume` collection ready for PDF export.
