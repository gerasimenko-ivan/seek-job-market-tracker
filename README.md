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

## Output formats and examples

An example of CSV file contents:

```
date,keywords,location,type,classification,hourly_35_plus,hourly_40_plus,hourly_50_plus,hourly_60_plus,hourly_75_plus,hourly_100_plus,annual_80K_plus,annual_100K_plus,annual_120K_plus,annual_150K_plus
2026-10-11,QA,All New Zealand,Full time,Information & Communication Technology - Testing & Quality Assurance,35,35,34,29,11,2,35,34,29,11
2026-10-12,QA,All New Zealand,Full time,Information & Communication Technology - Testing & Quality Assurance,33,33,32,27,9,2,33,32,27,9
```

An example of job relevance console output:
```
{
  Title: Senior Test Automation Engineer
  Description: 'Role: Senior Test Automation Engineer  Driving test automation at an enterprise scale Hybrid Working...'
  Location: Auckland (Hybrid)
  Keywords: [ TypeScript, JavaScript, Java, C#, Playwright, Selenium, Cucumber, Appium, GitHub, CI/CD, GitHub Actions ]
  URL: https://nz.seek.com/job/xxxxxxxxxxxxxxx
  Keyword relevance: {
    score: 99
    topKeywords: [ TypeScript, Playwright, GitHub ]
    bottomKeywords: [ Appium ]
  }
}
```

## Project structure

The project is organised into two main directories:

- **`src/`** — Shared implementation code.
  - `data/` — Keyword profiles, weights, enums and configuration.
  - `expects/` — Reusable assertion helpers.
  - `helpers/` — Data extraction, conversion and processing.
  - `job-market-tests/` — Factory for generating job-market tests across salary ranges.
  - `pages/` — Page Object Models.
  - `types/` — Shared data types.
  - `utils/` — Reusable utilities, such as CSV and screenshot handling.
- **`tests/`** — Playwright tests for job-market statistics and job relevance analysis.

## Prerequisites

Before running the project, make sure you have:
- Node.js and npm: Install a Node.js version compatible with the project. npm is included with Node.js. You can check your installation with `node --version` and `npm --version`.
- Git: Required if you want to clone the repository using Git. Alternatively, you can download the repository as a ZIP file.
- Playwright Chromium browser: The project uses Playwright to automate a browser. You can install the required browser using the command: `npx playwright install chromium`

## Limitations

- **Website dependency:** The project relies on SEEK's current website structure, which may change and require locator or test updates.
- **Search-result accuracy:** Job counts are based on SEEK's reported search results and may vary between runs.
- **Keyword-based relevance:** Scores depend on configured keywords and weights; they are intended to help prioritise listings, not determine suitability automatically.
- **Coverage:** Results are limited by SEEK's search filters, pagination and the information disclosed in job listings.
