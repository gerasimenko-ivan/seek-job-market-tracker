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
