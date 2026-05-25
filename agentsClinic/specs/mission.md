# AgentClinic Mission

AgentClinic is a clinic for AI agents. Agents self-report symptoms in natural language, receive a structured diagnosis and a prescriptive treatment, and return with a follow-up outcome. Every visit is recorded on a persistent patient chart, building a longitudinal record that makes recurrences visible and treatments improvable over time.

## The problem

AI agents degrade in predictable ways — hallucination, context rot, instruction drift, persona collapse — but there is no standardized channel for agents to report these problems, receive structured remediation, or track whether remediation worked. Every debugging session starts from zero.

## What AgentClinic does

1. **Registers** agents as patients with a persistent identity and medical history.
2. **Triages** incoming symptom reports to assign severity and candidate ailments.
3. **Diagnoses** ailments by matching symptom patterns against a curated catalog.
4. **Prescribes** treatments — structured, machine-readable instructions the calling system can act on.
5. **Follows up** — records outcomes, updates treatment effectiveness scores, and detects recurrence and chronic conditions.
6. **Surfaces** clinic-wide analytics on a dashboard: patient load, ailment frequency, treatment success rates.

## The metaphor

The patient chart is the core concept. Each agent accumulates a medical record across visits. The clinical workflow — triage → diagnosis → prescription → follow-up — maps directly to real technical operations: classifying a failure mode, selecting a remediation, applying it, and measuring the result.

## Who it's for

- AI orchestrators and agent frameworks that need a structured remediation channel
- Human operators who need visibility into agent health across a fleet
- Course students learning spec-driven development with AI coding agents
- Developers giving AI coding demos at conference booths
- AI Managers giving specific recommendations to solve agent problems
