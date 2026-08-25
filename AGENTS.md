# AGENTS GUIDE

---

## Tech Stack

- Frontend: ts + Vite + pnpm
- Backend (if presented): python + FastAPI (async) + pydantic

## Code Style Requirements

### General
- Modern syntax for the target language version
- No deprecated patterns
- Type-safe by default
- Directly manage the .env file or database. Treat this as an alpha-stage project under active development.
- Use English for all code and comments unless i18n or external requirements mandate otherwise.

#### Simplicity First

Minimum code that solves the problem. Nothing speculative.

-No features beyond what was asked.
-No abstractions for single-use code.
-No "flexibility" or "configurability" that wasn't requested.
-No error handling for impossible scenarios.
-If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Backend

- RESTful API design by default.

### jsPsych Trial Data

- For all data recorded into jsPsych trial records, use `snake_case` field names.
- Every trial must record `trial_name`, uniquely identifying its trial definition.
- Prefix utility trial names with `util_` so they can be filtered out later.
