# Social Planner (React + Vite)

A modern, full-featured social content planning and asset management app built with React, Vite, Zustand, and Styled-Components.

## Features

- **Content Calendar:** Plan, create, edit, and schedule content across platforms with a beautiful drag-and-drop calendar UI.
- **Asset Management:** Upload, preview, and organize images, videos, captions, and hashtags.
- **Recent Assets:** Modern Lucide icons for each asset type, with color-coded backgrounds.
- **Reusable Components:** Consistent UI with shared ActionButton, IconButton, and Modal components.
- **Custom Hooks:** Clean logic for modals, toasts, file import, and more.
- **Accessibility:** Keyboard navigation, focus outlines, and ARIA labels on all interactive elements.
- **Responsive Design:** Mobile-friendly layouts and components.
- **Performance:** Optimized with memoization, debounced search, code splitting, and lazy loading for images/videos.
- **Toast & SweetAlert2 Notifications:** User feedback for all major actions and safe confirmations for deletes.
- **File Import/Export:** Import/export content, captions, and hashtags via JSON/CSV.
- **Error Boundaries:** Robust error handling for a smooth user experience.

## Tech Stack

- **React 18** (functional components, hooks, React.lazy/Suspense)
- **Vite** (fast dev/build tooling)
- **Zustand** (state management)
- **Styled-Components** (CSS-in-JS)
- **Framer Motion** (animations)
- **React-Icons (Lucide, Feather, etc.)** (iconography)
- **SweetAlert2** (confirmation dialogs)
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
- Use `React.lazy` and `Suspense` for code splitting and lazy loading of heavy components and images/videos.
- Add `aria-label`, `aria-modal`, and other ARIA attributes to all interactive elements and modals.
- Remove unused code and imports regularly.
- Add tests for all critical logic and flows.

## Contributing

Pull requests and suggestions are welcome! Please open an issue or PR for any improvements or bug fixes.

---

Built with ❤️ using React, Vite, and modern web best practices.
