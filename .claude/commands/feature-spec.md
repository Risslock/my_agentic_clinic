Prepare a spec for the next unimplemented phase in the project roadmap and create the branch for it.

## Step 1 — Read context

Read all four of these files before doing anything else:

- `agentsClinic/specs/roadmap.md` — find the first phase that is NOT marked ✅. That is the target phase.
- `agentsClinic/specs/mission.md` — understand the product goals.
- `agentsClinic/specs/tech-stack.md` — understand the technical constraints and decisions already made.
- The most recently dated spec directory under `agentsClinic/specs/` (read all three files: plan.md, requirements.md, validation.md) — use it as the format reference.

## Step 2 — Ask before writing (REQUIRED)

You MUST call `AskUserQuestion` with exactly 3 questions in a single call before creating any file or branch. Do not write to disk before the user answers.

The three questions:

1. **Scope** (`header: "Scope"`, `multiSelect: true`): Based on the roadmap items for this phase, offer each line item as a selectable option plus an "Everything listed" option. Let the user include or cut scope.

2. **Key decisions** (`header: "Decisions"`, `multiSelect: false`): Ask which aspect the user wants to be most explicit about in requirements.md. Options should be drawn from the phase content — e.g. "Data model / schema", "UI & routing", "Integration points", "Out-of-scope boundaries". Always include an "All of the above" option.

3. **Branch name** (`header: "Branch name"`, `multiSelect: false`): Propose a kebab-case branch name derived from the phase title (e.g. `phase-3-therapies`). Offer 2–3 alternatives and an "Other" fallback. The user's answer becomes the exact branch name.

## Step 3 — Create branch

```
git checkout -b <branch-name-from-step-2>
```

## Step 4 — Create spec directory and files

Directory name: `agentsClinic/specs/YYYY-MM-DD-<slug>/` where the date is today and the slug is the kebab-case phase name (not the branch name — e.g. `2026-05-25-therapies-catalog`).

Create three files. Use the answers from Step 2 to shape the content. Use mission.md and tech-stack.md for guidance on language, constraints, and stack choices. Mirror the style and depth of the reference spec you read in Step 1.

### `requirements.md`

- **Scope** section: bullet list of in-scope items (from the user's answer to question 1)
- **Out of Scope** section: explicit list of deferred items
- **Decisions** section: one `###` heading per key decision, with rationale tied back to the tech stack and mission
- **Context** section: one paragraph explaining why this phase exists and what "done" unlocks for the next phase

### `plan.md`

Numbered task groups (Group 1, Group 2 …) ordered to minimise rework: schema/migrations first, then seed, then server logic, then UI, then tests, then a final Verify group. Each group contains numbered sub-tasks (plain imperative sentences, no bullet nesting). The last group is always "Verify" with: typecheck, test suite, manual curl/browser checks.

### `validation.md`

Four sections matching the established pattern:
1. **Type check** — `npm run typecheck`, exit 0
2. **Automated tests** — `npm test`, table of new test cases with assertion descriptions
3. **Manual verification** — curl or browser steps that confirm the golden path
4. **Merge criteria** — checkbox list that must all be ticked before the branch is merged

## Notes

- Never skip the AskUserQuestion call — it is the user's only chance to redirect scope before files are written.
- Do not create a single combined plan for multiple future phases; this command is always for one phase at a time.
- If the roadmap shows all phases complete, report that and stop.
