import { Step, StepType } from "../types/index.d";

/**
 * Parses an input XML string and converts it into an array of steps.
 *
 * ### Example Input:
 * ```xml
 * <boltArtifact id="project-import" title="Project Files">
 *   <boltAction type="file" filePath="eslint.config.js">
 *       import js from '@eslint/js';\nimport globals from 'globals';\n
 *   </boltAction>
 *   <boltAction type="shell">
 *       node index.js
 *   </boltAction>
 * </boltArtifact>
 * ```
 *
 * ### Example Output:
 * ```json
 * [
 *   {
 *     "title": "Project Files",
 *     "status": "Pending"
 *   },
 *   {
 *     "title": "Create eslint.config.js",
 *     "type": "StepType.CreateFile",
 *     "code": "import js from '@eslint/js';\nimport globals from 'globals';\n"
 *   },
 *   {
 *     "title": "Run command",
 *     "code": "node index.js",
 *     "type": "StepType.RunScript"
 *   }
 * ]
 * ```
 *
 * ### Notes:
 * - Input XML may contain extra strings between elements; these should be ignored.
 * - Each `<boltAction>` element is processed based on its `type` attribute:
 *   - **file**: Generates a step to create a file with the specified `filePath` and content.
 *   - **shell**: Generates a step to run a shell command with the provided content.
 * - The `<boltArtifact>` element's `title` attribute defines the initial step's title.
 */

export function parseXml(response: string): Step[] {
  const parser = new DOMParser();
  // IT IS WORKING BUT THIS SHOULD BE text/xml BUT IT IS NOT OKAY WE SHOULD CHANGE THE LOGIC HERE
  const xmlDoc = parser.parseFromString(response, "text/html");
  const boltArtifact = xmlDoc.querySelector("boltArtifact");
  if (!boltArtifact) return [];

  const artifactTitle = boltArtifact.getAttribute("title") || "Project Files";

  const steps: Step[] = [];
  let stepId = 1;

  // Initial step
  steps.push({
    id: stepId++,
    title: artifactTitle,
    description: "",
    type: StepType.CreateFolder,
    status: "pending",
  });

  // Process boltAction elements
  const actions = boltArtifact.querySelectorAll("boltAction");
  actions.forEach((action) => {
    const type = action.getAttribute("type");
    const filePath = action.getAttribute("filePath") || undefined;
    const content = action.textContent || "";

    if (type === "file") {
      steps.push({
        id: stepId++,
        title: `Create ${filePath || "file"}`,
        description: "",
        type: StepType.CreateFile,
        status: "pending",
        code: content.trim(),
        path: filePath,
      });
    } else if (type === "shell") {
      steps.push({
        id: stepId++,
        title: "Run command",
        description: "",
        type: StepType.RunScript,
        status: "pending",
        code: content.trim(),
      });
    }
  });

  return steps;
}

// export function parseXml(response: string): Step[] {
//   // Extract the XML content between <boltArtifact> tags
//   const xmlMatch = response.match(
//     /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/
//   );
//   console.log({ xmlMatch });
//   if (!xmlMatch) {
//     return [];
//   }

//   const xmlContent = xmlMatch[1];
//   const steps: Step[] = [];
//   let stepId = 1;

//   // Extract artifact title
//   const titleMatch = response.match(/title="([^"]*)"/);
//   console.log({ titleMatch });
//   const artifactTitle = titleMatch ? titleMatch[1] : "Project Files";

//   // Add initial artifact step
//   steps.push({
//     id: stepId++,
//     title: artifactTitle,
//     description: "",
//     type: StepType.CreateFolder,
//     status: "pending",
//   });

//   const actionRegex =
//     /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
//   // console.log({ actionRegex: actionRegex.exec(xmlContent) });
//   let match;
//   while ((match = actionRegex.exec(xmlContent)) !== null) {
//     const [, type, filePath, content] = match;

//     if (type === "file") {
//       // File creation step
//       steps.push({
//         id: stepId++,
//         title: `Create ${filePath || "file"}`,
//         description: "",
//         type: StepType.CreateFile,
//         status: "pending",
//         code: content.trim(),
//         path: filePath,
//       });
//     } else if (type === "shell") {
//       // Shell command step
//       steps.push({
//         id: stepId++,
//         title: "Run command",
//         description: "",
//         type: StepType.RunScript,
//         status: "pending",
//         code: content.trim(),
//       });
//     }
//   }

//   return steps;
// }

export const a = `boltArtifact id="project-import" title="Project Files">

          <boltAction type="file" filePath="eslint.config.js">
          import js from '@eslint/js';import globals from 'globals';import reactHooks from 'eslint-plugin-react-hooks';import reactRefresh from 'eslint-plugin-react-refresh';import tseslint from 'typescript-eslint';export default tseslint.config(  { ignores: ['dist'] },  {    extends: [js.configs.recommended, ...tseslint.configs.recommended],    files: ['**/*.{ts,tsx}'],    languageOptions: {      ecmaVersion: 2020,      globals: globals.browser,    },    plugins: {      'react-hooks': reactHooks,      'react-refresh': reactRefresh,    },    rules: {      ...reactHooks.configs.recommended.rules,      'react-refresh/only-export-components': [        
          'warn',        { allowConstantExport: true },      ],    },  });</boltAction>

          <boltAction type="file" filePath="index.html"><!doctype html><html lang="en">  <head>    <meta charset="UTF-8" />    <link rel="icon" type="image/svg+xml" href="/vite.svg" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <title>Vite + React + TS</title>  </head>  <body>    <div id="root"></div>    <script type="module" src="/src/main.tsx"></script>  </body></html></boltAction>
          
          <boltAction type="file" filePath="package.json">{  "name": "vite-react-typescript-starter",  "private": true,  "version": "0.0.0",  "type": "module",  "scripts": {    "dev": "vite",    "build": "vite build",    "lint": "eslint .",    "preview": "vite preview"  },  "dependencies": {    "lucide-react": "^0.344.0",    "react": "^18.3.1",    "react-dom": "^18.3.1"  },  "devDependencies": {    "@eslint/js": "^9.9.1",    "@types/react": "^18.3.5",    "@types/react-dom": "^18.3.0",    "@vitejs/plugin-react": "^4.3.1",    "autoprefixer": "^10.4.18",    "eslint": "^9.9.1",    "eslint-plugin-react-hooks": "^5.1.0-rc.0",    "eslint-plugin-react-refresh": "^0.4.11",    "globals": "^15.9.0",    "postcss": "^8.4.35",    "tailwindcss": "^3.4.1",    "typescript": "^5.5.3",    "typescript-eslint": 
          "^8.3.0",    "vite": "^5.4.2"  }}</boltAction>

          <boltAction type="file" filePath="postcss.config.js">export default {  plugins: {    tailwindcss: {},    autoprefixer: {},  },};</
          boltAction>

          <boltAction type="file" filePath="tailwind.config.js">/** @type {import('tailwindcss').Config} */export default {  content: ['./index.
          html', './src/**/*.{js,ts,jsx,tsx}'],  theme: {    extend: {},  },  plugins: [],};</boltAction>

          <boltAction type="file" filePath="tsconfig.app.json">{  "compilerOptions": {    "target": "ES2020",    "useDefineForClassFields": true,    "lib": ["ES2020", "DOM", "DOM.Iterable"],    "module": "ESNext",    "skipLibCheck": true,    /* Bundler mode */    "moduleResolution": "bundler",    "allowImportingTsExtensions": true,    "isolatedModules": true,    "moduleDetection": "force",    "noEmit": true,    "jsx": "react-jsx",    /* Linting */    "strict": true,    "noUnusedLocals": true,    "noUnusedParameters": true,    
          "noFallthroughCasesInSwitch": true  },  "include": ["src"]}</boltAction>

          <boltAction type="file" filePath="tsconfig.json">{  "files": [],  "references": [    { "path": "./tsconfig.app.json" },    { "path": "./
          tsconfig.node.json" }  ]}</boltAction>

          <boltAction type="file" filePath="tsconfig.node.json">{  "compilerOptions": {    "target": "ES2022",    "lib": ["ES2023"],    "module": "ESNext",    "skipLibCheck": true,    /* Bundler mode */    "moduleResolution": "bundler",    "allowImportingTsExtensions": true,    "isolatedModules": true,    "moduleDetection": "force",    "noEmit": true,    /* Linting */    "strict": true,    "noUnusedLocals": 
          true,    "noUnusedParameters": true,    "noFallthroughCasesInSwitch": true  },  "include": ["vite.config.ts"]}</boltAction>

          <boltAction type="file" filePath="vite.config.ts">import { defineConfig } from 'vite';import react from '@vitejs/plugin-react';// https://vitejs.dev/config/export default defineConfig({  plugins: [react()],  optimizeDeps: {    exclude: ['lucide-react'],  },});</
          boltAction>

          <boltAction type="file" filePath="src/App.tsx">import React from 'react';function App() {  return (    <div className="min-h-screen bg-gray-100 flex items-center justify-center">      <p>Start prompting (or editing) to see magic happen :)</p>    </div>  );}export 
          default App;</boltAction>

         
          <boltAction type="file" filePath="src/index.css">@tailwind base;@tailwind components;@tailwind utilities;</boltAction>

          <boltAction type="file" filePath="src/main.tsx">import { StrictMode } from 'react';import { createRoot } from 'react-dom/client';import App from './App.tsx';import './index.css';createRoot(document.getElementById('root')!).render(  <StrictMode>    <App />  </StrictMode>);
          </boltAction>

          <boltAction type="file" filePath="src/vite-env.d.ts">/// <reference types="vite/client" /></boltAction>
          </boltArtifact>`;
