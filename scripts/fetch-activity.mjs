#!/usr/bin/env node
// Pulls public GitHub activity for the profile's activity card into data/activity.json.
// Needs a token in GITHUB_TOKEN (the Actions token is enough; locally: GITHUB_TOKEN=$(gh auth token)).
// The contribution calendar already includes private contributions, because the profile has
// "Include private contributions" turned on; no private repo names or details are fetched.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOGIN = 'JuanDLCH';
const SKIP_REPOS = new Set([LOGIN]); // the profile repo itself isn't "shipped work"
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'activity.json');

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN is not set');
  process.exit(1);
}

const query = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
    repositories(first: 6, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false,
                 orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        name description pushedAt stargazerCount
        primaryLanguage { name color }
      }
    }
  }
}`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-activity-card' },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
});
const json = await res.json();
if (!res.ok || json.errors) {
  console.error(JSON.stringify(json.errors || json, null, 2));
  process.exit(1);
}
const user = json.data.user;
const cal = user.contributionsCollection.contributionCalendar;
const days = cal.weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, n: d.contributionCount })));

// Streaks. Today may still be empty early in the day, so a streak that ended yesterday still counts.
let longest = 0, run = 0;
for (const d of days) { run = d.n > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
let current = 0;
for (let i = days.length - 1; i >= 0; i--) {
  if (days[i].n > 0) current++;
  else if (i === days.length - 1) continue;
  else break;
}

const recent = user.repositories.nodes.filter((r) => !SKIP_REPOS.has(r.name)).slice(0, 3)
  .map((r) => ({ name: r.name, language: r.primaryLanguage?.name ?? null, color: r.primaryLanguage?.color ?? null, pushedAt: r.pushedAt, stars: r.stargazerCount }));

const data = {
  generatedAt: new Date().toISOString().slice(0, 10), // date only, so re-runs on the same day don't commit
  total: cal.totalContributions,
  private: user.contributionsCollection.restrictedContributionsCount,
  streak: { current, longest },
  days,
  recent,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, 1) + '\n');
console.log(`wrote ${OUT}: ${data.total} contributions (${data.private} private), streak ${current}/${longest}`);
