Maintain CHANGELOG.md at the project root. Entries are grouped by date (most recent first), each date as a `## YYYY-MM-DD` heading with commit subjects as bullets.

## Step 1 — Collect commits

Run:

```
git log --format="%ad|||%s" --date=short
```

Parse each line into `{ date, subject }`. Discard any line whose subject starts with `"Merge"`.

## Step 2 — Check for an existing CHANGELOG.md

### No CHANGELOG.md

Group all parsed commits by date, most recent first. Within each date preserve git log order (newest commit first). Write the file to the project root:

```
# Changelog

## YYYY-MM-DD

- subject
- subject

## YYYY-MM-DD

- subject
```

### CHANGELOG.md already exists

1. Read the file and find the most recent `## YYYY-MM-DD` heading. Record that value as `lastDate`.
2. From the parsed commits, keep only those whose date is strictly greater than `lastDate`.
3. If none remain: report "CHANGELOG.md is already up to date." and stop.
4. If any remain: group them by date (most recent first) and prepend the new date sections between the `# Changelog` title line and the first existing `##` heading. Do not touch anything below that point.

## Rules

- Never modify or remove existing entries.
- Do not add a date section that is already present in the file.
- Use commit subjects exactly as written — no paraphrasing or summarising.
- Leave one blank line between the last bullet of one date section and the `##` heading of the next.
