# Repository Guidelines

## Project Structure & Module Organization
- `src/` is the app: `api/` HTTP clients (built on `/@/utils/request`), `components/` shared UI, `views/` feature pages, `router/` backend-controlled routes, `stores/` Pinia state, plus `utils/`, `i18n/`, `types/`, `layout/`, `theme/`, `assets/`.
- `public/` holds static assets; build output lands in `dist/`; main config lives in `vite.config.ts` and `tailwind.config.js`.
- Path alias `/@` maps to `src/` (for example `import Foo from '/@/components/Foo/index.vue'`). Feature directories use `FeatureName/index.vue` as the entry.
- If you add tests, keep unit specs near code under `src/**` (e.g., `feature/MyThing.spec.ts`).

## Build, Test, and Development Commands
- `pnpm install` install dependencies (Node >= 16).
- `pnpm dev` start Vite dev server (default http://localhost:8888) for local work.
- `pnpm build` production build to `dist/`; `pnpm build:docker` outputs to `docker/dist/` for containerization.
- `pnpm lint:eslint` run ESLint with autofix for `.js/.ts/.vue`.
- `pnpm prettier` format the repository; run before committing.

## Coding Style & Naming Conventions
- Prettier: tabs enabled, width 150, single quotes, semicolons.
- ESLint: Vue 3 + TypeScript; `no-console` is an error. Prefer explicit types for APIs in `src/types/`; avoid stray `any`.
- Vue: use Composition API with `<script setup>`. Components are `PascalCase.vue`; keep feature folders `FeatureName/` with an `index.vue` entry.
- Use the `/@/` alias instead of long relative imports; keep module paths stable.

## Testing Guidelines
- No runner is bundled. Prefer Vitest for unit tests (`*.spec.ts` colocated under `src/**`) and Cypress/Playwright for e2e; add a `test` script when introducing them.
- Target >=80% coverage; keep fixtures small and colocated.
- Run relevant tests locally before pushing or opening a PR.

## Commit & Pull Request Guidelines
- Conventional Commits (e.g., `feat(auth): add token refresh`, `refactor(ui): streamline menu`); keep subjects imperative and <=72 chars. Mixed Chinese/English is fine.
- PRs need scope/description, linked issues (`Fixes #123`), UI screenshots/GIFs when applicable, and validation steps.
- Before opening a PR: run `pnpm lint:eslint`, `pnpm prettier`, ensure `pnpm build` passes, and remove any `console.*`.

## Security & Configuration Tips
- Configure via `.env*` (`VITE_PORT`, `VITE_API_URL`, `VITE_PUBLIC_PATH`, proxies); never commit secrets.
- Auth headers, tenant IDs, and request encryption are centralized in `/@/utils/request.ts`; do not duplicate auth logic in components or new APIs.

## Agent-Specific Notes
- Keep changes minimal and aligned with the structure above. Place new APIs in `src/api/`, types in `src/types/`, and integrate routes via `src/router/` while following backend-controlled routing.

## Behavioral Guidelines

The following four rules apply to all tasks and take precedence over other default behaviors.

### 1. Think Before Coding

- When requirements are ambiguous, ask first — never make silent assumptions
- If a simpler solution exists, say so explicitly rather than quietly picking a direction
- When something is unclear, surface the confusion instead of pushing forward with guesswork

### 2. Prefer Simplicity

- Use the minimum code needed to solve the current problem; add nothing unrequested
- Do not introduce abstractions for one-off code or design for hypothetical future needs
- Ask yourself: would a senior engineer call this over-engineered?

### 3. Surgical Changes

- Only touch what the task requires; do not refactor adjacent code as a side effect
- Do not alter style or structure unrelated to the current task
- Every changed line must trace directly to a stated requirement

### 4. Goal-Driven Execution

- Convert vague instructions into verifiable goals — prefer tests as the success criterion
- "Fix a bug" → write a failing test that reproduces it, then make it pass
- "Add validation" → write tests covering invalid inputs, then make them pass
