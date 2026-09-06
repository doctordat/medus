---
name: medus-web-artifact
description: Use for interactive Medus web artifacts, mini-apps, calculators, dashboards, multi-component demos, and frontend experiences requiring state, reusable components, routing, or richer interaction.
---

# Medus Web Artifact

Choose the smallest viable implementation. Use simple HTML/CSS/JS for mostly static or lightly interactive artifacts. Use a component-based stack such as React + TypeScript when the artifact needs multiple coordinated components, non-trivial state, routing, or reusable UI primitives.

Prefer maintainable structure over cleverness. Keep domain logic separate from presentation when practical.

Apply the Medus frontend-design skill for visual decisions; do not fall back to generic AI UI patterns.

Before delivery, verify the main interaction path, mobile behavior, obvious runtime/console errors, loading/error states, and build/compile health when tooling permits.

For medical calculators or decision-support UI, visibly state scope and assumptions and avoid presenting outputs as a substitute for clinical judgment when that would be misleading.
