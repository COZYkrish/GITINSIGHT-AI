# Repository Coding Standards & TypeScript Guidelines

1. **Strict Typing**: Never use `any` unless explicitly justified with comments. Prefer `unknown` and type guards.
2. **Immutability**: Prefer `readonly` arrays and `const` declarations.
3. **Module Boundaries**: Keep files focused on a single responsibility (< 300 lines recommended).
4. **Error Handling**: Throw domain errors inheriting from `AppError`. Never swallow caught exceptions silently.
