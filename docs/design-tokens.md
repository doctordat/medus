# MEDUS Learner Design Tokens v1

## Design DNA
Professional medical education: off-white/light blue-gray background, MEDUS teal + navy, white surfaces, restrained border/shadow, high information density with readable whitespace. No purple AI SaaS, neon, glassmorphism or cartoon gamification.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--medus-navy` | `#082f3d` | headings, focus mode header |
| `--medus-teal` | `#008c97` | primary CTA, links, progress |
| `--medus-cyan` | `#25c2c7` | accent/active progress |
| `--medus-ink` | `#173c44` | body text |
| `--medus-muted` | `#668087` | metadata/secondary text |
| `--medus-bg` | `#f5fafb` | page background |
| `--medus-surface` | `#ffffff` | cards/article surfaces |
| `--medus-line` | `#d8e9eb` | borders/dividers |
| `--medus-soft` | `#eaf8f8` | selected/info state |
| `--medus-success` | `#277a58` | correct/passed |
| `--medus-warning` | `#fff7e7` | incomplete/review attention |
| `--medus-danger` | `#fff0ee` | error/safety warning |

## Typography
- UI font: `Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`.
- Display: `clamp(40px, 6vw, 72px)`, weight 950, letter-spacing `-.06em`.
- Page heading: `clamp(32px, 5vw, 56px)`, weight 900.
- Section heading: 25–30px, weight 850.
- Learner body: 15–16px, line-height 1.78–1.85.
- Metadata/caption: 10–12px, line-height 1.55.

## Spacing
Use 4px base: `--space-1:4px`, `--space-2:8px`, `--space-3:12px`, `--space-4:16px`, `--space-5:20px`, `--space-6:24px`, `--space-8:32px`, `--space-10:40px`, `--space-12:48px`, `--space-16:64px`.

## Shape/elevation
- `--medus-radius-sm: 10px`
- `--medus-radius: 16px`
- `--medus-radius-lg: 22px`
- `--medus-border: 1px solid var(--medus-line)`
- `--medus-shadow: 0 14px 40px rgba(8,47,61,.08)`
- Prefer border over strong floating shadow.

## Responsive breakpoints
- `--bp-mobile: 620px`
- `--bp-tablet: 900px`
- `--bp-desktop: 1200px`
- Mobile is one-column and touch-first, not a shrunken desktop.
- Interactive targets: minimum 44px height.
- Reserve safe-area bottom padding for mobile nav.

## Interaction/semantic states
- Hover: slight lift (`translateY(-2px)`) + restrained shadow.
- Focus: 3px teal translucent outline, never color-only.
- Disabled: opacity `.45`, cursor not-allowed, retain readable label.
- Loading: skeleton/placeholder; never fake progress.
- Empty: explain cause + next action.
- Incomplete content: warning surface and exact `N/13`.
- Correct: success green + reasoning.
- Incorrect: danger tint + remediation CTA.
- Draft/review: admin/editorial only; never learner-visible.
- Published/public: learner-visible when RLS/entitlement allows.
- Premium locked: show metadata + upgrade/access gate, never leak body content.

## Mapping
- Home: display/heading/hero tokens + goal/priority action surfaces.
- Learn: card, article, TOC, resource and incomplete-state tokens.
- QBank: focus-mode header, option states, feedback/remediation tokens.
- Cases: step timeline, vitals, decision cards and feedback tokens.
- Mastery: progress, competency, recommendation and empty-state tokens.
- Resource: image/PDF/video/link cards use same surface/border/radius/status tokens.

## Rules
Tokens are the source of visual truth for new components. Existing page-specific variables may be migrated gradually; do not big-bang rewrite. Medical review/status semantics are data rules, not merely colors.
