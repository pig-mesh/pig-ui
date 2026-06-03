# GEMINI.md

## Project Overview

This project is the frontend for Pig, an open-source permission management and microservices scaffold. It keeps the core admin, authentication, code generation, monitoring, and system tooling features needed for straightforward deployment.

**Key Technologies:**

*   **Framework:** Vue.js 3
*   **Build Tool:** Vite
*   **State Management:** Pinia
*   **UI Library:** Element Plus
*   **Styling:** Tailwind CSS
*   **Routing:** Vue Router
*   **Language:** TypeScript

**Architecture:**

The application features a modular architecture with a clear separation of concerns. It uses Vue Router with backend-provided menu routes, while local static routes cover login and error pages. State management is handled by Pinia, with dedicated stores for user information, routes, and other application-level concerns. The UI is built using the Element Plus component library and styled with Tailwind CSS.

## Building and Running

**Prerequisites:**

*   Node.js (>=16.0.0)
*   pnpm

**Development:**

To run the project in development mode with hot-reloading, use the following command:

```bash
pnpm dev
```

**Building for Production:**

To build the application for production, use the following command:

```bash
pnpm build
```

The production-ready files will be generated in the `dist` directory.

**Linting:**

To lint the code and fix any issues, run the following command:

```bash
pnpm lint:eslint
```

## Development Conventions

*   **Coding Style:** The project follows the standard Vue.js and TypeScript coding conventions. It also uses Prettier for automatic code formatting.
*   **Component-Based Architecture:** The application is built using a component-based architecture. Components are organized by feature and are designed to be reusable and maintainable.
*   **State Management:** Pinia is used for state management. The stores are organized by domain and are used to manage the application's state in a predictable and efficient manner.
*   **Routing:** The application uses Vue Router for routing. The routes are defined in the `src/router` directory and can be configured to be either frontend-controlled or backend-controlled.
*   **API Integration:** The application communicates with the backend API through a proxy server configured in `vite.config.ts`. The API calls are encapsulated in the `src/api` directory.
