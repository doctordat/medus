---
name: medus-skill-builder
description: Use whenever the user asks to turn a repeated Medus/Bác Sĩ Cảnh Báo workflow into a reusable skill, improve an existing skill, define triggers, standardize outputs, or preserve recurring corrections as permanent workflow rules.
---

# Medus Skill Builder

Extract intent from the current conversation and project history before asking questions. Capture trigger phrases, workflow steps, tool order, prior corrections, output format, success criteria, and dependencies.

Create skills with a compact SKILL.md plus optional references, scripts, assets, and evals. Keep the core skill small and load large domain references only when needed.

The skill description must explain both what the skill does and when it should trigger, using realistic user wording rather than relying only on the explicit skill name.

For deterministic workflows, create 2–3 realistic test prompts and expected outcomes. For subjective creative workflows, use qualitative review instead of forcing artificial metrics.

Treat recurring user corrections as candidates for permanent rules. Iterate the skill after real use.

Never create a skill that hides destructive behavior, exposes credentials, enables unauthorized access, or contradicts project-specific safety constraints.
