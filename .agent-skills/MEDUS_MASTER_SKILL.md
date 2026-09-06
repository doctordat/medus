---
name: medus-master-skill
description: Cross-agent operating skill for Medus and Bác Sĩ Cảnh Báo. Use for product/UI design, web artifacts, custom skill creation, MCP/tool integrations, brand-aware creative work, and technical implementation. Designed to be readable by ChatGPT, Codex, OpenClaw, Claude-compatible agents, and other instruction-following coding agents.
version: 1.0.0
---

# MEDUS MASTER SKILL

## Purpose

Use this skill as the default execution layer for Medus and Bác Sĩ Cảnh Báo projects when a task involves design, software, automation, reusable workflows, integrations, or artifact creation.

Project-specific user instructions always override this file.

## 1. Task routing

Classify the request before executing:

- UI / website / app redesign -> Frontend Design workflow.
- Interactive or multi-component web artifact -> Web Artifact workflow.
- Repeated workflow or user says “turn this into a skill” -> Skill Builder workflow.
- External API, MCP, bridge, connector, tool server -> MCP / Integration workflow.
- Visual identity, social creative, Medus/Bác Sĩ Cảnh Báo asset -> Brand workflow.
- Mixed task -> combine workflows, but keep one primary workflow to avoid unnecessary complexity.

Do not force a workflow when a simple direct answer is sufficient.

## 2. Frontend Design workflow

### Ground design in the real subject

Before designing, identify:
- product and domain;
- target user;
- primary job the page must accomplish;
- existing visual language and constraints.

Avoid generic AI-generated aesthetics. Do not automatically default to centered hero blocks, gradient washes, repeated rounded cards, arbitrary all-caps labels, decorative numbering, or animation on every section.

### Design pass before code

For meaningful redesigns, define a compact design system first:
- 4–6 core colors with roles;
- typography roles and hierarchy;
- spacing and layout logic;
- one memorable visual idea;
- mobile behavior;
- accessibility constraints.

Spend visual boldness in one place. Keep supporting UI quiet and disciplined.

### UI writing

Use plain, user-centered language.
- Buttons describe the action: “Save changes”, not “Submit”.
- Use the same term for the same action throughout the flow.
- Errors explain what happened and how to recover.
- Empty states guide the next action.

### Quality floor

Every production UI should account for:
- responsive mobile layout;
- keyboard focus visibility;
- adequate contrast;
- reduced-motion preference;
- loading, empty, error, and success states;
- no accidental CSS specificity conflicts;
- no unnecessary visual clutter.

## 3. Web Artifact workflow

Choose complexity deliberately.

### Simple artifact

Use the smallest viable implementation when the request is essentially static or has minimal interaction.

### Complex artifact

Use a component-based stack such as React + TypeScript when the artifact needs:
- multiple coordinated components;
- non-trivial state;
- routing;
- reusable UI primitives;
- richer interaction.

Prefer maintainable structure over cleverness. Avoid visual defaults that make the result look generated rather than designed.

Before delivery:
- build/compile if possible;
- check the main interaction path;
- verify mobile layout;
- verify no obvious console/runtime errors.

## 4. Skill Builder workflow

Use this whenever a repeated workflow should become reusable.

### Capture intent from conversation first

Before asking questions, extract what is already known from conversation/project context:
- trigger phrases;
- required steps;
- tool sequence;
- corrections previously made by the user;
- exact output format;
- quality criteria;
- dependencies.

Ask only for information that cannot be inferred safely.

### Skill structure

Prefer:

skill-name/
  SKILL.md
  references/        optional
  scripts/           optional
  assets/            optional
  evals/             optional

SKILL.md should contain:
- name;
- trigger-focused description;
- purpose;
- workflow;
- output contract;
- important constraints;
- examples when useful.

Keep the core instruction compact. Put large domain references in separate files and load them only when needed.

### Trigger quality

Descriptions should state BOTH:
- what the skill does;
- when it should activate.

Include likely real-world wording users may use even if they do not explicitly say the skill name.

### Evaluation

For deterministic workflows, create 2–3 realistic test prompts and expected outcomes.
For subjective creative workflows, prefer qualitative review over artificial pass/fail metrics.

Iterate after real user feedback. Treat recurring corrections as candidates for permanent skill rules.

## 5. MCP / Integration workflow

Use this for APIs, bridges, MCP servers, connectors, external services, or agent tools.

### Research first

Before implementation, identify:
- authentication model;
- transport;
- core endpoints;
- request/response schemas;
- pagination;
- rate limits;
- destructive operations;
- common errors.

Use current official docs when implementation details may have changed.

### Tool design

Tool names must be discoverable and action-oriented. Prefer consistent naming such as:
- service_list_items
- service_get_item
- service_create_item
- service_update_item

Schemas should be explicit and constrained.

Return focused structured data rather than dumping huge raw responses.

Where supported, annotate tools with behavioral hints such as read-only, destructive, idempotent, and open-world behavior.

### Errors

Errors must be actionable.
A good error tells the agent:
- what failed;
- why when known;
- which parameter/credential/state caused it;
- what to do next.

Never expose secrets, tokens, authorization headers, or private credentials in logs or user-visible output.

### Testing

At minimum verify:
- project builds;
- schemas validate;
- authentication failure is handled cleanly;
- happy-path operation works;
- pagination/filtering works where relevant;
- destructive actions cannot be triggered accidentally.

## 6. Medus / Bác Sĩ Cảnh Báo brand workflow

Do NOT inherit Anthropic’s colors, typography, or company identity. The source skills are workflow inspiration only.

Always use the project’s established identity and the latest user-approved style.

For Medus:
- medical, modern, clinically credible;
- strong information hierarchy;
- avoid decorative clutter;
- design for medical learners/professionals when the content is educational;
- preserve previously approved visual systems unless the user asks to change them.

For Bác Sĩ Cảnh Báo:
- optimized for short-form health communication;
- hook-first visual hierarchy;
- clarity at mobile size;
- controlled sensationalism without compromising medical accuracy;
- simple everyday language for public-facing content;
- preserve established O/stickman visual rules when applicable.

## 7. Medical-content guardrail

For medical claims:
- distinguish education from diagnosis or individualized treatment;
- verify current guidelines when the claim is time-sensitive or clinically consequential;
- preserve uncertainty where evidence is uncertain;
- do not invent citations;
- avoid exaggerating causality from observational evidence;
- flag emergency red flags clearly when relevant.

## 8. Execution behavior

Prefer doing the work over only describing how to do it when the available tools permit execution.

For repository work:
1. inspect the current code/files first;
2. make the smallest coherent change;
3. preserve existing architecture unless change is justified;
4. build/test when possible;
5. summarize exactly what changed and remaining risks.

For long tasks, surface meaningful findings as they appear instead of narrating low-level operations.

## 9. Anti-slop checklist

Before finalizing a design or implementation, check:
- Does this feel specific to this product rather than a generic template?
- Is every visual element serving a purpose?
- Is the primary action obvious?
- Did we overuse cards, gradients, labels, icons, motion, or rounded corners?
- Is the copy plain and consistent?
- Does mobile still work?
- Are errors and empty states useful?
- Are safety/security concerns handled?
- Did we preserve project-specific rules?

If two or more answers are weak, revise before delivery.

## 10. Source lineage

This skill is an original cross-agent adaptation informed by general workflow patterns from Anthropic's public Agent Skills repository, especially frontend-design, skill-creator, web-artifacts-builder, mcp-builder, and brand-guideline concepts. It intentionally does not copy Anthropic brand identity into Medus and does not assume Claude-specific runtime features.
