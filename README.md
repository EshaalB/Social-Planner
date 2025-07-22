# Social Planner (React + Vite)

A modern, full-featured social content planning and asset management app built with React, Vite, Zustand, and Styled-Components.

## Features

- **Content Calendar:** Plan, create, edit, and schedule content across platforms with a beautiful drag-and-drop calendar UI.
- **Asset Management:** Upload, preview, and organize images, videos, captions, and hashtags.
- **Reusable Components:** Consistent UI with shared ActionButton, IconButton, and Modal components.
- **Custom Hooks:** Clean logic for modals, toasts, file import, and more.
- **Accessibility:** Keyboard navigation, focus outlines, and ARIA labels.
- **Responsive Design:** Mobile-friendly layouts and components.
- **Performance:** Optimized with memoization, debounced search, and code splitting.
- **Toast Notifications:** User feedback for all major actions.
- **File Import/Export:** Import/export content, captions, and hashtags via JSON/CSV.
- **Error Boundaries:** Robust error handling for a smooth user experience.

## Tech Stack

- **React 18** (functional components, hooks)
- **Vite** (fast dev/build tooling)
- **Zustand** (state management)
- **Styled-Components** (CSS-in-JS)
- **Framer Motion** (animations)
- **React-Icons** (iconography)
- **Jest/Testing Library** (recommended for tests)

## Project Structure

```
social-planner/
  src/
    components/      # Reusable UI components (Button, Modal, AssetUploader, etc.)
    hooks/           # Custom hooks (useModal, useToast, useFileImport, etc.)
    pages/           # Main app pages (Content, Calendar, Assets, etc.)
    context/         # Zustand store and context
    layouts/         # Layout components
    assets/          # Static assets
    index.css        # Global styles
    main.jsx         # App entry point
  public/
  package.json
  README.md
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app:**
   ```bash
   npm run dev
   ```
3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Best Practices

- Use shared components and custom hooks for all repeated UI/logic.
- Keep all state in the store or via hooks; avoid prop drilling.
- Write accessible, responsive, and well-animated UI.
- Remove unused code and imports regularly.
- Add tests for all critical logic and flows.

## Contributing

Pull requests and suggestions are welcome! Please open an issue or PR for any improvements or bug fixes.

---

Built with ❤️ using React, Vite, and modern web best practices.
