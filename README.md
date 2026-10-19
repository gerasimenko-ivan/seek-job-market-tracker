# SEEK Job Market Tracker

## Project overview

A TypeScript and Playwright project that collects job-market statistics from SEEK New Zealand and analyses individual job listings using configurable, weighted keyword profiles.

The project supports two workflows:
1. **Job-market statistics:** Collect search-result counts across salary ranges and other search criteria, exporting observations to CSV for historical analysis.
2. **Job relevance analysis:** Extract individual job details, identify relevant keywords, calculate weighted relevance scores, and rank listings to help prioritise relevant opportunities.

The project currently includes keyword profiles for QA Automation and Clinical Research roles.

## Features and Workflows

### Workflow 1: Job-market statistics

Purpose: Track how many jobs match specific search criteria, including salary ranges.
Files
- tests/seek-search-qa-jobs.spec.ts
- tests/seek-search-clinical-research-jobs.spec.ts

Configurable parameters
- Keywords
- Location
- Job type
- Classification
- Salary ranges collected as separate searches

Output: CSV files containing job-count observations for later comparison over time.

### Workflow 2: Job relevance analysis

Purpose: Collect individual job listings, identify matching keywords, calculate weighted relevance scores, and rank jobs.
Files
- tests/seek-search-qa-job-cards.spec.ts
- tests/seek-search-clinical-research-job-cards.spec.ts

Configurable parameters
- Keywords
- Location
- Job type
- Salary
- Classification

Output: console output with job details, matched keywords, relevance scores, and rankings.

## How to Run

### Workflow 1: Job-market statistics

Run the QA job-market statistics:

```
npx playwright test tests/seek-search-qa-jobs.spec.ts --project=chromium --workers=1
```

Run the clinical research job-market statistics:

```
npx playwright test tests/seek-search-clinical-research-jobs.spec.ts --project=chromium --workers=1
```

Why these options?

--project=chromium runs the test using the configured Chromium project instead of running it across every configured browser project.

--workers=1 limits Playwright to one parallel worker. This is a precaution because concurrent searches have sometimes produced inconsistent results during data collection.

The worker setting controls concurrency between Playwright tests; it does not guarantee that SEEK will return consistent counts.

### Workflow 2: Job relevance analysis

Run the QA job relevance analysis:

```
npx playwright test tests/seek-search-qa-job-cards.spec.ts --project=chromium
```

Run the clinical research job relevance analysis:

```
npx playwright test tests/seek-search-clinical-research-job-cards.spec.ts --project=chromium
```

Why --project=chromium?

This runs the test using the configured Chromium project, avoiding duplicate executions across other configured browser projects.

## Configuration

Search parameters (keywords, location, job type, salary, and classification) can be adjusted in the relevant test files under tests/.

Keyword profiles and their relevance weights are defined in:

- src/data/keyword-qa.ts
- src/data/keyword-clinical-research.ts

Weights determine how strongly matching keywords contribute to each job's relevance score.
