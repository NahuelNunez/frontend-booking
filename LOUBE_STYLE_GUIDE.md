# Loube style guide · Capsule, black and cyan

The time slot is the brand. Its capsule shape shows up everywhere (buttons, tags, the logo), on a black stage with one bright cyan for action and highlight. It is not tied to any field: it fits salons, clinics, studios, spas, coaches, any business that runs on appointments.

The full theme is in `loube-theme.css`. Paste it into `src/index.css` right after `@import "tailwindcss";`.

## 1. Principles

1. **The slot is the brand.** The capsule shape of a time slot appears in buttons, tags and the logo. People learn it in one booking.
2. **Cyan means go.** Cyan marks the one thing to tap. Everything else stays black, white and soft grey, so the next step is obvious.
3. **Black is the stage.** The hero and owner panels are black so cyan glows on them. Cyan is a highlight, never a background for whole sections.

## 2. Color

| Token (Tailwind) | Light | Dark | Use |
|---|---|---|---|
| `primary` | #00D2E6 | #00E5FF | Main button, selected slot, focus |
| `primary-strong` | #00B8CC | #5CEFFF | Hover and pressed |
| `primary-soft` | #D5F7FB | #06292E | Selected backgrounds |
| `primary-text` | #007585 | #3FE6F7 | Cyan words and icons on light backgrounds |
| `on-primary` | #031417 | #031417 | Text on cyan (always dark) |
| `spark` | #00E5FF | #00E5FF | One highlight per screen on black |
| `on-spark` | #031417 | #031417 | Text on spark |
| `hero` | #0A0A0B | #17171A | Black hero band and owner panels, white text |
| `ink` | #0A0A0B | #F2F2F3 | Text |
| `muted` | #5E6569 | #9C9CA3 | Secondary text |
| `paper` | #F4F5F5 | #0A0A0B | Page background |
| `surface` | #FFFFFF | #141416 | Panels, cards, inputs |
| `sunken` | #ECEEEF | #1C1C1F | Quiet fills, code |
| `line` | #E0E3E4 | #2A2A2E | Hairlines |
| `line-strong` | #C4C9CB | #3A3A40 | Input and slot borders |
| `star` | #007585 | #00E5FF | Rating stars only |

**Proportion:** about 62% paper, 24% surface, 8% ink/black, 5% cyan, 1% spark.

**Rule:** bright cyan never carries text on white. Use `text-primary-text` for cyan words on light backgrounds, and dark `on-primary` text on any cyan fill.

## 3. Appointment status

Always a color plus a word, never color alone.

| Status | Text (light / dark) | Background (light / dark) | Meaning |
|---|---|---|---|
| `pending` | #9A6A00 / #F2C04D | #FFF3D1 / #33290F | Held, waiting for the deposit |
| `confirmed` | #007585 / #3FE6F7 | #D5F7FB / #06292E | Deposit paid or approved |
| `completed` | #12795A / #6FD8AE | #E1F5EC / #10301F | They came and can review |
| `cancelled` | #6B7175 / #9C9CA3 | #ECEEEF / #1C1C1F | The time is free again |
| `noshow` | #C2335F / #FF8FB1 | #FDE6EE / #3A1524 | Never arrived, deposit kept |

Usage: `bg-confirmed-soft text-confirmed`.

## 4. Typography

| Role | Font | Weights | Use |
|---|---|---|---|
| `font-display` | Unbounded | 700–800 | Headlines only, tight spacing (-0.02em). Round, wide letters like the capsule |
| `font-sans` | Onest | 400–700 | Body text, buttons, labels, forms |
| `font-mono` | Geist Mono | 400–500 | Times, durations, prices, codes |

Fonts link for `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Onest:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
```

Type scale:

| Class | Size | Example |
|---|---|---|
| `text-7xl` display | 88px / 0.92 | Every hour. |
| `text-4xl` display | 44px / 1.02 | Pick a time |
| `text-2xl` | 28px / 1.15 | Your booking |
| `text-lg` | 20px / 1.45 | Consultation and follow-up |
| `text-base` | 16px / 1.6 | Your time is held until the deposit goes through. |
| `text-sm` | 14px / 1.5 | Prices in Argentine pesos |
| `text-xs` mono, uppercase | 12px | THU 30 OCT · 16:30–18:00 |

## 5. Shape

**The slot (capsule) has five looks:**

- Free: outline on white.
- Selected: cyan fill, dark text, soft cyan glow (`shadow-float`).
- Held for a deposit: dashed outline in the pending color.
- Booked: solid black.
- Unavailable: hairline diagonal hatch.

**Corners:** `rounded-sm` 8px, `rounded-md` 14px, `rounded-lg` 24px, `rounded-pill` 999px (slots, buttons, tags).

**Spacing:** 4px steps: 4, 8, 12, 16, 24, 32, 48, 64.

**Elevation:** hairline border by default for panels; `shadow-float` for the selected slot and the main button; `shadow-overlay` for menus, sheets and dialogs.

## 6. Patterns

One per screen, always behind content, never under text without a surface.

| Utility | What it is | Where |
|---|---|---|
| `pattern-capsules` | Rows of time-slot outlines | Black hero band and owner panels |
| `ring-word` | Outlined capsule around one headline word | One word per headline |
| `sticker` | Small tilted pill label | Hero only, max two |
| `pattern-orbit` | Rings like a clock face | Hero backgrounds |
| `pattern-glow` | A soft cyan light | Behind the hero only |
| `pattern-grid` | A grid that fades at the edges | Empty states |
| `pattern-hours` | One line per hour | Behind the agenda |
| `pattern-unavailable` | Diagonal hatch | Time off, breaks, closed hours |

Avoid: two patterns on one screen, glow inside the owner dashboard.

## 7. Motion

- **Select (spring, 350ms):** tapping a slot grows it slightly and turns it cyan.
- **Pop in:** a new appointment arriving in the agenda.
- **Rolling dot:** replaces spinners while free times load.
- Everything stops when the user prefers reduced motion.

## 8. UX rules

Booking order: **Branch → Professional → Services → One time → Name + phone.**

1. **One visit, one time.** One professional does every chosen service. The client picks one start time and sees the total duration and price. Never ask for a separate time per service.
2. **Only show what is free.** Never show a time and then reject it. Dim days with no openings and open on the first free day.
3. **No account for clients.** Ask for a name and phone at the very end, then hand over a private booking link.
4. **No surprises with money.** Deposit now, amount later and total stay visible, with the currency on every price.
5. **Today first.** The owner dashboard opens on today. Only things that need action get color.
6. **Made for thumbs.** Slots at least 44px tall, the main button at the bottom on phones, nothing scrolls sideways.

## 9. Voice

Short, warm and specific. Say what happens next.

| Moment | Avoid | Write |
|---|---|---|
| Main button | Submit | Book for 16:30 |
| Success | Appointment created successfully | You're booked, Lucía. See you Thursday at 16:30. |
| Time taken | Error 409: conflict | Someone just took 16:30. Here are the next free times. |
| Phone error | Invalid input | Add your country code, like +54 9 11 2233 4455. |
| Full day | No data | Ana is fully booked on Friday. Saturday has 6 free times. |

## 10. Example

```html
<button class="rounded-pill bg-primary px-6 py-3 font-semibold text-on-primary shadow-float hover:bg-primary-strong">Book for 16:30</button>
<h1 class="font-display text-7xl">Every hour, <span class="ring-word">booked</span>.</h1>
<section class="bg-hero text-white pattern-capsules">…</section>
<span class="text-primary-text font-mono text-xs uppercase">Thu 30 Oct · 16:30</span>
```
