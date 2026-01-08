- Collateral is a capital-enforced self-betting platform where users lock funds against binary, objectively measurable outcomes.
- The system enforces an append-only ledger where all actions are immutable and outcomes are irreversible with no appeals.
- Primary funding is denominated in USD to maintain a professional tone, explicitly avoiding crypto-native aesthetics or gamification.
- Success and failure are determined automatically by rigid verification adapters that allow for zero human discretion.
- The backend serves as the deterministic enforcer of logic while the Aura-built frontend acts as the canonical state reference.

# Core Invariants
- Contracts resolve strictly to binary success or failure with no partial credit, rounding, or tolerance bands.
- Once execution begins, all parameters including deadline and stake are permanently locked and cannot be modified.
- Every state change is recorded in an append-only ledger that serves as the undisputed retrospective history.
- Verification relies exclusively on deterministic third-party signals with absolutely no capacity for manual overrides or appeals.
- Economic settlements are calculated mechanistically based on rigid difficulty tiers and admit no retroactive adjustments.

# Current State

## Built
- The high-fidelity frontend has been fully specified in Aura, establishing the canonical UX flows and visual hierarchy.
- The Global Ledger page and Profile history views are implemented as read-only displays of the append-only event log.
- The Contract Selector and Execution flows are visually complete, culminating in the critical "EXECUTE CONTRACT" action.

## Not Built
- The backend logic is currently nonexistent, with no database schema, API endpoints, or state machine implementation.
- All frontend buttons are currently unwired, lacking connection to real APIs for verification, funding, or execution.
- The core mathematical engines for target scaling, payout calculations, and difficulty tiers have not yet been implemented.
