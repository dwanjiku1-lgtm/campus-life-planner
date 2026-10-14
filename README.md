# Campus Life Planner 

Hey! Welcome to the **Campus Life Planner**. I built this as a lightweight, framework-free web app to help university students stay on top of their assignments, study hours, deadlines, and weekly time goals. 

No heavy build tools or frameworks required—just clean, modular vanilla JavaScript, HTML, and CSS.

---

> **Live GitHub Pages URL**: (https://github.com/dwanjiku1-lgtm/campus-life-planner)


## Chosen Theme:
 Campus life planner





## colors for the web app and why

 "Shades of Brown" (Academic Workspace)
For the visual design, I went with a warm, cozy **"Shades of Brown"** palette. 
* **Design Rationale**: The earthy tones (warm espresso, cream, and terracotta accents) create a calm, focused, and distraction-free environment tailored for long study sessions.
* **Architecture**: Built with a responsive app shell featuring a desktop sidebar that gracefully collapses into a compact topbar navigation menu on smaller mobile screens.

---

##  Features List
1. Modular Codebase: Clean separation of concerns with dedicated files for state (`state.js`), storage (`storage.js`), and input validation (`validators.js`).
2. Dynamic Task Management: Easily add, edit, complete, and delete tasks with custom tags and time estimates.
3. Smart Search & Filters: Filter through your tasks instantly with case-insensitive search queries.
4. Flexible Sorting: Sort your task list by date, title, or duration.
5. Weekly Time Capping: Keep your workload balanced against a custom weekly hour cap with progress tracking.

---

##  Regular Expression (Regex) Catalog
To make sure data stays clean, I implemented strict validation rules using regular expressions in `scripts/validators.js`. Here are the patterns along with valid and invalid examples:

| Validation Type | Regex Pattern / Logic | Example: Valid Input ✅ | Example: Invalid Input ❌ |
| :--- | :--- | :--- | :--- |
| **Title Validation** | `/^\S(.*\S)?$/` (+ length check) | `"Midterm Prep"` | `" "` or `""` (empty) |
| **Duration Validation** | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` + bounds | `45` or `"120"` | `-15` or `2000` (exceeds limit) |
| **Date Format** | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | `"2026-10-18"` | `"10-18-2026"` or `"2026-13-40"` |
| **Tag Validation** | `/^[a-zA-Z0-9\s-]{2,30}$/` | `"Study-Group"` | `"Tag@#$!"` (special symbols) |
| **Duplicate Word Check** | `/\b(\w+)\s+\1\b/i` | `"Study hard for exams"` | `"Study study hard"` (repeated words) |

---

##  Keyboard Map & Shortcuts
You can navigate the app smoothly using standard keyboard controls:
1. `Tab` / `Shift + Tab`: Move logically through form inputs, action buttons, and filters.
2. `Enter`: Submit forms, add tasks, or trigger search actions.
3. `Escape`: Dismiss modals or cancel active task editing.

---

##  Accessibility (a11y) Notes
1. Semantic Structure: Built using proper HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`) for clean screen reader support.
2. High Contrast Color Palette: Designed with a warm contrast ratio between text elements and card backgrounds ensuring high legibility.
3. Focus Visibility: Clear focus rings are maintained on all interactive elements so keyboard-only users can navigate effortlessly without losing their place.

---

##  How to Run Tests
I included an automated test suite so you can verify all regex validation rules instantly without having to manually type test cases into the UI forms.

1. Open your browser or local server.
2. Navigate to the test runner file:
   ```text
   [http://127.0.0.1:5500/tests.html](http://127.0.0.1:5500/tests.html) (or open tests.html directly via Live Server)


## Repository Structure
Here is a look at the clean, modular layout of the project codebase:

```text
campus-life-planner/
│
├── index.html           # Main application shell and UI views
├── tests.html           # Dedicated automated test runner dashboard
├── seed.json            # Diverse sample data records for testing import/export
├── README.md            # Comprehensive project documentation
│
├── styles/              # Visual design and layout stylesheets
│   ├── base.css         # CSS design tokens, typography, and color variables
│   ├── components.css   # Modular card, form, and widget styles
│   └── tests.css        # Specialized styling for the test suite runner
│
└── scripts/             # Core application logic and modules
    ├── state.js         # Central AppState manager, pub/sub observers, and mutations
    ├── storage.js       # localStorage wrapper and JSON import validation
    └── validators.js    # Strict regular expression rules and edge-case checks    