# Contract State Machine

## Allowed States

- CREATED
- FUNDS_AUTHORIZED
- FUNDS_LOCKED
- LOCKED
- VERIFYING
- VERIFIED
- SETTLED
- FORFEITED

## Allowed Transitions

| From | To |
|------|----|
| CREATED | FUNDS_AUTHORIZED |
| FUNDS_AUTHORIZED | FUNDS_LOCKED |
| FUNDS_LOCKED | LOCKED |
| LOCKED | VERIFYING |
| VERIFYING | VERIFIED |
| VERIFIED | SETTLED |
| VERIFIED | FORFEITED |

## Terminal States

- SETTLED
- FORFEITED

## Invariants

- All state transitions are append-only.
- No state is ever rewritten or mutated.
- State is derived from ordered ledger events at query time.
- Ledger events cannot be updated or deleted.
