# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PIGX UI Pro is a Vue 3 enterprise admin platform built on top of the PIGCLOUD microservices framework. The application uses backend-controlled routing where menu permissions are determined by API responses.

**Tech Stack**: Vue 3 (Composition API), TypeScript, Element Plus, Pinia, Vue Router, Vite, Tailwind CSS, DaisyUI

## Common Commands

```bash
# Development
npm run dev              # Start dev server at localhost:8888

# Build
npm run build            # Production build with max heap 8GB
npm run build:docker     # Build for Docker deployment

# Code Quality
npm run lint:eslint      # Lint and fix JS/TS/Vue files
npm run prettier         # Format all files
```

## Development Workflow

### API Integration

All API calls must be placed in `src/api/` directory and follow this pattern (refer to `src/api/admin/audit.ts`):

```typescript
import request from '/@/utils/request';

export function fetchList(query?: Object) {
  return request({
    url: '/admin/audit/page',
    method: 'get',
    params: query,
  });
}
```

- **Always use `await` syntax** when calling API methods, then destructure the result
- The centralized axios instance at `src/utils/request.ts` handles:
  - Automatic token injection (`Authorization` header)
  - Tenant ID management (`TENANT-ID` header)
  - Request/response encryption/decryption
  - Token expiration (424) and tenant expiration (426) handling
  - URL adaptation for single/microservice architecture

### Routing Architecture

The application uses **backend-controlled routing** (configured via `isRequestRoutes: true` in the router):

1. Routes are fetched from the backend API on app initialization (`src/router/backEnd.ts`)
2. Dynamic routes are processed and injected into the router via `initBackEndControlRoutes()`
3. Route components are dynamically loaded using Vite's `import.meta.glob` from `src/views/**/*.{vue,tsx}`
4. Routes support only **two-level nesting** for keep-alive compatibility
5. Navigation guards in `src/router/index.ts` handle authentication and route initialization

**Key files**:
- `src/router/backEnd.ts` - Backend route processing and dynamic route injection
- `src/router/route.ts` - Static routes (login, 404, 401) and base route structure
- `src/router/index.ts` - Router instance, guards, and route flattening utilities

### State Management (Pinia)

Stores are organized in `src/stores/`:
- `userInfo.ts` - User information and authentication state
- `routesList.ts` - Dynamic menu routes from backend
- `tagsViewRoutes.ts` - Tab navigation state
- `keepAliveNames.ts` - Component caching for keep-alive
- `themeConfig.ts` - Theme and layout configuration
- `dict.ts` / `param.ts` - Dictionary and parameter caching

All stores use Pinia with persistence enabled via `pinia-plugin-persist`.

### Component Structure

- `src/components/` - Reusable components (auto-registered globally via `src/components/index.ts`)
- `src/views/` - Page-level components organized by feature modules (admin, knowledge, flow, gen, etc.)
- `src/layout/` - Application layout components and route views

### Global Properties

Global utilities are auto-imported via `unplugin-auto-import`:
- `parseTime` / `parseDate` - Date formatting utilities (globally available)
- `baseURL` - API base URL (globally available)
- Vue 3, Vue Router, Pinia APIs are auto-imported

### Environment Configuration

Environment variables are defined in `.env.development`, `.env.local`, etc.:
- `VITE_PORT` - Dev server port (default: 8888)
- `VITE_API_URL` - API base URL
- `VITE_ADMIN_PROXY_PATH` - Backend proxy target
- `VITE_PUBLIC_PATH` - Public path for production builds
- `VITE_GRAY_VERSION` - Gray version header for canary deployments

## Code Style Guidelines

### Vue Components

- Use Vue 3 **Composition API** (`<script setup>`) exclusively
- Break down large components into smaller, maintainable pieces
- Use `name` attribute via `vite-plugin-vue-setup-extend` for keep-alive support
- Implement proper error handling with try/catch in setup functions

### TypeScript

- Prefer explicit typing for function parameters and return values
- Use TypeScript interfaces for API request/response types (stored in `src/types/`)
- Leverage auto-imports for better developer experience

### Styling

- **Tailwind CSS**: Primary utility framework
  - Follow responsive design patterns with Tailwind modifiers
  - Use `@apply` directive for component-level styling
  - Customize via `tailwind.config.js`
- **Element Plus**: UI component library
  - Colors and themes should align with `src/theme/element.scss`
  - Leverage Element Plus form validation
- **Dark Mode**:
  - Use CSS custom properties from `src/theme/dark.scss`
  - Always scope with `[data-theme='dark']` selector
  - Maintain Twitter-inspired color scheme consistency
  - Key variables: `--next-bg-main`, `--next-color-white`, `--next-border-color`, `--next-text-color-regular`

### Axios Best Practices

- All API logic resides in `src/api/` (never inline in components)
- Use `await` with proper error handling
- Authentication token and tenant ID are injected automatically
- Request encryption is enabled by default (disable with `Enc-Flag: false` header)

### Vue Router

- Use named routes for better maintainability
- Implement route-level code splitting
- Leverage route meta fields for permissions, caching, etc.
- All dynamic routes come from backend API response

## Architecture Notes

### Path Alias

The `/@/` alias resolves to `src/` directory (configured in `vite.config.ts`).

### Build Configuration

- **Development**: Uses esbuild for fast builds
- **Production**: Uses Terser with console/debugger removal and comment stripping
- **Code Splitting**: Vue ecosystem and Echarts are split into separate chunks
- **Compression**: Gzip compression enabled via `vite-plugin-compression`

### Mock Server

Mock APIs are available in development mode via `vite-plugin-mock` (stored in `src/mock/`).

### i18n Support

Internationalization is configured via `vue-i18n` in `src/i18n/`, supporting both Chinese and English locales.

### Icon System

SVG icons are processed via custom `svgBuilder` plugin and located in `src/assets/icons/`.