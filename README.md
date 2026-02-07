## Testing Tools Playground (React + TypeScript)

This project is a **React + TypeScript testing playground**.  
The home page exposes a **dashboard of tool modules** – currently implemented as **clearly marked placeholders**.  
Each time you open a tool, its **usage count** increases and the dashboard automatically reorders tools so the **most frequently used tools appear first**.

The app is built with:

- **Create React App (TypeScript template)**
- **React + TypeScript**
- **Material UI (MUI)** for layout and components

---

## Prerequisites

- **Node.js**: recommended **v18+**
- **npm**: comes with Node.js (or you can use **yarn** if you prefer and adjust commands accordingly)

To check your versions:

```bash
node -v
npm -v
```

---

## Environment setup

From a clean machine, follow these steps to get the project running:

1. **Clone the repository**

   ```bash
   git clone <your-repo-url> ai-react
   cd ai-react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   - By default, CRA serves on `http://localhost:3000/`
   - This app is configured with a base path of `/ai-react`, so the main UI is available at:
     - `http://localhost:3000/ai-react` during local development
   - The page reloads automatically when you edit files
   - TypeScript and lint issues will appear in the console

4. **Build for production (optional)**

   ```bash
   npm run build
   ```

   - Outputs an optimized production build into the `build` directory

---

## How to access the app

- **Local development**
  - Start the dev server with `npm start`.
  - Open `http://localhost:3000/ai-react` in your browser.
- **After deployment**
  - The app assumes it is hosted under the `/ai-react` path.
  - If you deploy to `https://your-domain.com`, the app should be reachable at:
    - `https://your-domain.com/ai-react/`

If you decide to host the app at a different base path, update:

- `"homepage"` in `package.json`
- The `basename` prop in `src/index.tsx` (`<BrowserRouter basename="/ai-react">`)

---

## Available scripts

In the project directory, you can run:

- **`npm start`**: Run the development server.
- **`npm test`**: Run tests in watch mode (CRA default Jest setup).
- **`npm run build`**: Create a production build in the `build` folder.
- **`npm run eject`**: Eject CRA configuration (not recommended unless you know you need it).

---

## Project structure (key files)

High-level structure of the app:

- **`src/index.tsx`**
  - CRA entry point.
  - Wraps the app in a **MUI `ThemeProvider`** and applies `CssBaseline`.
- **`src/App.tsx`**
  - Defines the **main layout** (MUI `AppBar`, `Container`, and page content).
  - Renders the **Tool Dashboard** (list of tool cards).
  - Connects the usage-tracking hook and the placeholder dialog.
- **`src/types/Tool.ts`**
  - TypeScript `Tool` interface:
    - `id`, `name`, `description`, `usageCount`.
- **`src/hooks/useToolUsage.ts`**
  - Custom hook that:
    - Defines an initial list of **placeholder tools** (e.g. API Tester, Data Generator).
    - Loads and saves usage counts from/to **`localStorage`**.
    - Returns a list of tools **sorted by `usageCount` (descending)** so the most-used tools appear first.
    - Exposes `incrementUsage(toolId)` to update counts when a tool is opened.
- **`src/components/ToolCard.tsx`**
  - MUI `Card` component to display a single tool:
    - Name, description, usage count chip, and an **Open** button.
- **`src/components/ToolGrid.tsx`**
  - MUI `Grid` layout that renders a responsive grid of `ToolCard`s.
- **`src/components/ToolPlaceholderDialog.tsx`**
  - Simple MUI `Dialog` that appears when a tool is opened.
  - Clearly communicates that the content is a **placeholder entry point** for the future real tool.

---

## How the tool placeholders work

- On load, the app defines a **static list of placeholder tools** in `useToolUsage`:
  - Examples: *API Tester (Placeholder)*, *Data Generator (Placeholder)*, *Mock Auth (Placeholder)*, etc.
  - Each is just a **stub entry point** where you can later plug in real functionality.
- Every time you click **Open** on a tool card:
  - The `incrementUsage(tool.id)` function is called.
  - The usage count is **stored in `localStorage`**, so it persists across page reloads.
  - The tools array is re-sorted so tools with higher `usageCount` appear **earlier in the list**.
- The **placeholder dialog** is shown with explanatory text indicating that this is where the real tool will live.

This means the **most frequently used tools naturally bubble up to the top of the dashboard**, even across browser sessions.

---

## Adding or replacing tools later

When you're ready to turn placeholders into real tools (or add new ones):

1. **Add or update tool entries**

   - Open `src/hooks/useToolUsage.ts`.
   - Edit the `INITIAL_TOOLS` array:
     - Update `name` and `description` for an existing placeholder **or**
     - Add a new entry with a unique `id`.

2. **Create the real tool UI**

   - Create a new component under `src/components/` or in a feature-specific folder, for example:

     ```tsx
     // src/components/ApiTesterTool.tsx
     export const ApiTesterTool = () => {
       // Replace with your real implementation
       return <div>API Tester Tool goes here.</div>;
     };
     ```

3. **Wire it into the Open flow**

   - Currently, the **Open** button triggers the `ToolPlaceholderDialog`.
   - When you have a real tool, you can:
     - Replace the dialog content based on `tool.id`, or
     - Navigate to a dedicated page/route (if you add React Router), or
     - Render the tool inline below the grid.

This design keeps the home page as a **central launcher** for multiple tools, while making it easy to evolve each placeholder into a full-featured module.

---

## Deployment notes and recommendations

- **Create a production build**
  - Run:

    ```bash
    npm run build
    ```

  - This generates a static bundle in the `build` directory that respects the `/ai-react` base path configured in:
    - `package.json` via `"homepage": "/ai-react"`
    - `src/index.tsx` via `BrowserRouter basename="/ai-react"`.

- **Serve the build locally for testing**

  ```bash
  npx serve -s build
  ```

  - Then open the URL printed in the terminal, typically `http://localhost:3000/ai-react`.

- **Deploying to a static host (S3, Netlify, etc.)**
  - Build the app: `npm run build`.
  - Upload everything inside the `build` folder to your host.
  - Ensure your host:
    - Serves `index.html` for any route under `/ai-react/*` (SPA fallback).
    - Serves JS/CSS assets from the same `/ai-react` base path.

- **Hosting at a different path or at domain root**
  - If you host at the domain root (`https://your-domain.com/`):
    - Change `"homepage"` in `package.json` to `"."` (or remove it).
    - Update `BrowserRouter` in `src/index.tsx` to remove the basename:

      ```tsx
      <BrowserRouter>
        <App />
      </BrowserRouter>
      ```

    - Re-run `npm run build` and redeploy the new `build` folder.

---

## Notes and recommendations

- This project is intended for **testing and experimentation**, so feel free to:
  - Add more placeholder modules.
  - Swap out MUI components or customize the MUI theme.
  - Adjust the **base path** if your hosting setup changes (update `"homepage"` and `basename`).
- If you change the way tools are stored or identified, ensure that:
  - Each tool still has a **stable, unique `id`**.
  - The usage tracking logic in `useToolUsage` is updated accordingly.

---

## Learn more

- React: `https://reactjs.org`
- Create React App docs: `https://facebook.github.io/create-react-app/docs/getting-started`
- Material UI docs: `https://mui.com/material-ui/getting-started/overview/`
