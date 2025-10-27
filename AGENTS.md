# Repository Guidelines

## Project Structure & Module Organization
- `src/` application code: `api/` (HTTP clients via `/@/utils/request`), `components/` (global/ui), `views/` (pages by feature), `router/` (backend‑controlled routes), `stores/` (Pinia), `utils/`, `i18n/`, `types/`, `layout/`, `theme/`, `assets/`.
- `public/` static files; `dist/` build output; config in `vite.config.ts`, `tailwind.config.js`.
- Path alias: `/@` -> `src/`.

## Build, Test, and Development Commands
- `pnpm install` install dependencies (Node >= 16).
- `pnpm dev` start Vite dev server (default `http://localhost:8888`).
- `pnpm build` production build to `dist/`.
- `pnpm build:docker` build to `docker/dist/` for containerization.
- `pnpm lint:eslint` ESLint check + autofix for `.js/.ts/.vue`.
- `pnpm prettier` format repo with Prettier.

## Coding Style & Naming Conventions
- Prettier: tabs enabled, width 150, single quotes, semicolons; run `pnpm prettier` before PRs.
- ESLint: Vue 3 + TypeScript; `no-console` is an error. Prefer explicit types for APIs in `src/types/`.
- Vue: use Composition API with `<script setup>`. Component files `PascalCase.vue`; feature directories `FeatureName/` with `index.vue` entry.
- Imports should use `/@/` alias (e.g., `import Foo from '/@/components/Foo/index.vue'`).

## Testing Guidelines
- No unit/e2e runner is configured. If adding tests, prefer Vitest for unit (`*.spec.ts` under `src/**`) and Cypress/Playwright for e2e. Add a `test` script and target ≥80% coverage in CI.

## Commit & Pull Request Guidelines
- Conventional Commits: `feat(scope): summary`, `refactor(scope): summary`, etc. Keep subjects imperative, ≤72 chars. Mixed Chinese/English is acceptable.
- PRs must include: clear description/scope, linked issues (`Fixes #123`), screenshots/GIFs for UI, and validation steps.
- Before opening a PR: run `pnpm lint:eslint`, `pnpm prettier`, ensure `pnpm build` succeeds, and remove any `console.*`.

## Security & Configuration Tips
- Configure via `.env*` (`VITE_PORT`, `VITE_API_URL`, `VITE_PUBLIC_PATH`, proxies). Never commit secrets.
- Auth headers, tenant ID, and request encryption are centralized in `/@/utils/request.ts`; do not duplicate auth logic in components.

## Agent‑Specific Notes
- Keep changes minimal and aligned with the structure above.
- Place new APIs in `src/api/`, types in `src/types/`, and integrate routes via `src/router/` respecting backend‑controlled routing.

