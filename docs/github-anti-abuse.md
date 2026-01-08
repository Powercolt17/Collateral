# GitHub Anti-Abuse Policy

> Complete anti-abuse framework for GitHub PR contracts.

---

## Why PR Contracts Are Not Free Money

GitHub PR contracts have multiple layers of protection against farming:

| Layer | Defense |
|-------|---------|
| **Repo Eligibility** | Only established repos (age, activity, size) |
| **Tier Gating** | STANDARD forbidden; minimum thresholds enforced |
| **PR Eligibility** | Only reviewed PRs from external approvers count |
| **Anti-Sybil** | Caps, cooldowns, escalating minimums |
| **Terminal Forfeit** | Deleted repo or revoked access = lose stake |

---

## Repo Eligibility Gates

Enforced at contract creation:

| Check | Requirement | Rationale |
|-------|-------------|-----------|
| **Age** | `created_at >= 30 days ago` | Prevents throwaway repos |
| **Activity** | `pushed_at <= 30 days ago` | Ensures repo is active |
| **Size** | `>= 1000 KB` | Filters empty/trivial repos |

**Snapshotted in baseline:**
- `repoCreatedAtUtc`
- `repoPushedAtUtc`
- `repoSizeKb`

---

## Tier Gating + Difficulty Floors

| Tier | Allowed | Min Threshold | Max Window |
|------|---------|---------------|------------|
| STANDARD | ❌ | — | — |
| ADVANCED | ✅ | 5 PRs | 30 days |
| ELITE | ✅ | 10 PRs | 30 days |

---

## PR Eligibility: Option A (Reviewed PRs Only)

Only PRs with **at least 1 approval from a non-author** count.

### Requirements
- Approval state = `APPROVED`
- Reviewer `user.id` != Author `user.id` (numeric, immutable)
- Self-approvals do not count

### API Used
```
GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews?per_page=100
```

### Existing Hard Filters (still apply)
| Filter | Check |
|--------|-------|
| Window | `merged_at` in `[EXECUTION_CONFIRMED, deadline]` |
| Branch | `base.ref` == `defaultBranch` (snapshotted) |
| Author | `user.id` == `principalGithubUserId` (snapshotted) |

---

## Error Classification (403/429/404)

| Scenario | Classification | Result |
|----------|----------------|--------|
| 429 | RATE_LIMIT | Retryable, schedule retry |
| 403 with rate-limit headers | RATE_LIMIT | Retryable, schedule retry |
| 403 WITHOUT rate-limit headers | RESOURCE_MISSING | Terminal VERIFICATION_FAILED (forfeit) |
| 404 | RESOURCE_MISSING | Terminal VERIFICATION_FAILED (forfeit) |

### Rate-Limit Header Detection
```
retry-after present OR
x-ratelimit-remaining == 0 OR
x-ratelimit-reset present
```

---

## Repo Access Revoked / PR Deleted

| Event | Result |
|-------|--------|
| Repo deleted | 404 → RESOURCE_MISSING → Forfeit |
| Repo made private | 403 (no rate-limit headers) → RESOURCE_MISSING → Forfeit |
| User revokes OAuth | 403 (no rate-limit headers) → RESOURCE_MISSING → Forfeit |
| PR deleted | Undercount → User fails verification → Forfeit |

**Policy:** User is responsible for maintaining access. Revoking access = forfeit, not error.

---

## Anti-Sybil Controls

Enforced at contract creation:

| Control | Rule | Error |
|---------|------|-------|
| **Active Contract Cap** | Max 2 active per user | "Maximum 2 active contracts allowed" |
| **Creation Cooldown** | 24h between contracts | "Must wait 24h between contracts" |
| **Escalating Min Lock** | 2+ failures in 7d → min doubles | "Minimum lock is $20 (escalated)" |

### Base Minimum Lock
- $10 (1000 cents)
- Doubles to $20 after 2+ failures in 7 days

---

## Receipt Transparency

### Baseline Snapshot (at creation)
```json
{
  "principalGithubUserId": "12345",
  "defaultBranch": "main",
  "repoOwner": "org",
  "repoName": "repo",
  "repoCreatedAtUtc": "2024-01-01T00:00:00Z",
  "repoPushedAtUtc": "2025-12-01T00:00:00Z",
  "repoSizeKb": 5000
}
```

### Verification Evidence (at verification)
```json
{
  "totalQualifiedPRs": 3,
  "totalCandidatePRs": 7,
  "excludedWrongAuthor": 1,
  "excludedWrongBranch": 1,
  "excludedOutsideWindow": 1,
  "excludedNoApproval": 1,
  "qualifiedPrs": [...]
}
```
